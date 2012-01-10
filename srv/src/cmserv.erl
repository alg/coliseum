-module(cmserv).
-compile(export_all).

-record(state, {videos,     %% orddict: youtubeid - [ pid, pid2 ]
                clients,    %% orddict: pid - youtubeid
                comments}). %% orddict: youtubeid -> [ comments ]
start() ->
  erlang:register(?MODULE, Pid = spawn(?MODULE, init, [])),
  Pid.

stop() ->
  ?MODULE ! shutdown.

register() ->
  ?MODULE ! {self(), register}.

subscribe(YoutubeId) ->
  ?MODULE ! {self(), {subscribe, YoutubeId}}.

comment(YoutubeId, Body) ->
  ?MODULE ! {self(), {comment, YoutubeId, Body}}.

comments(YoutubeId) ->
  ?MODULE ! {self(), {comments, YoutubeId}},
  receive
    {ok, List} -> List
  end.

code_change() ->
  ?MODULE ! upgrade.

init() ->
  loop(#state{videos = orddict:new(), clients = orddict:new(), comments = orddict:new()}).

loop(S = #state{}) ->
  %io:format("Clients: ~p~n Videos: ~p~n", [ S#state.clients, S#state.videos ]),
  receive
    {Pid, register} ->
      erlang:monitor(process, Pid),
      loop(S);

    {Pid, {subscribe, YoutubeId}} ->
      NewVideos1 = unsubscribe(Pid, S#state.clients, S#state.videos),

      % Subscribe
      ClientPids = case orddict:find(YoutubeId, NewVideos1) of
        {ok, Pids} -> Pids;
        error      -> []
      end,
      NewVideos = orddict:store(YoutubeId, [Pid|ClientPids], NewVideos1),
      NewClients = orddict:store(Pid, YoutubeId, S#state.clients),

      loop(S#state{clients = NewClients, videos = NewVideos});

    {_Pid, {comment, YoutubeId, Body}} ->
      NewComments = add_comment(YoutubeId, Body, S#state.comments),
      case orddict:find(YoutubeId, S#state.videos) of
        {ok, Pids} -> send_comment(Pids, Body);
        error ->
          ok
      end,
      loop(S#state{comments = NewComments});

    {Pid, {comments, YoutubeId}} ->
      YComments = case orddict:find(YoutubeId, S#state.comments) of
        {ok, Comments} -> Comments;
        error -> []
      end,
      Pid ! {ok, YComments},
      loop(S);

    {'DOWN', _Ref, process, Pid, _Reason} ->
      NewVideos = unsubscribe(Pid, S#state.clients, S#state.videos),
      NewClients = orddict:erase(Pid, S#state.clients),
      loop(S#state{videos = NewVideos, clients = NewClients});

    upgrade ->
      ?MODULE:loop(S);

    Unknown ->
      io:format("Unknown message: ~p~n", [ Unknown ]),
      loop(S)
  end.

unsubscribe(Pid, Clients, Videos) ->
  case orddict:find(Pid, Clients) of
    {ok, Id} ->
      case orddict:find(Id, Videos) of
        {ok, Pids} ->
          orddict:store(Id, lists:delete(Pid, Pids), Videos);
        error ->
          Videos
      end;
    error ->
      Videos
  end.

add_comment(YoutubeId, Body, CommentsMap) ->
  CurrentComments = case orddict:find(YoutubeId, CommentsMap) of
    {ok, Comments} -> Comments;
    error -> []
  end,
  orddict:store(YoutubeId, [Body|CurrentComments], CommentsMap).

send_comment(Pids, Body) ->
  lists:map(fun(Pid) -> Pid ! {comment, Body} end, Pids).
