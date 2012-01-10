-module(wsserv).
-compile(export_all).

-record(state, {ws, youtube_id}).

% start misultin http server
start() -> start(8080).

start(Port) ->
  misultin:start_link([
      {port, Port},
      {name, ?MODULE},
      {loop, fun(_) -> ok end},
      {ws_loop, fun(Ws) -> handle_websocket(Ws) end}]).

% stop misultin
stop() ->
	misultin:stop(?MODULE).

% callback on received websockets data
handle_websocket(Ws) ->
  cmserv:register(),
  loop(#state{ws = Ws}).

loop(S = #state{ws = Ws}) ->
  receive
    {browser, Data} ->
      case parse_data(Data) of
        {join, YoutubeId} ->
          cmserv:subscribe(YoutubeId),
          Response = lists:foldl(fun(X, Acc) -> Acc ++ "~" ++ X end, "comments", cmserv:comments(YoutubeId)),
          Ws:send([Response]),
          loop(S#state{youtube_id = YoutubeId});

        {comment, Body} ->
          cmserv:comment(S#state.youtube_id, Body),
          loop(S);

        Unknown ->
          io:format("Unknown request: ~p~n", [ Unknown ]),
          loop(S)
      end;

    {comment, Body} ->
      Ws:send(["comment~" ++ Body]),
      loop(S);

    _Ignore ->
      loop(S)
  end.

parse_data(Data) ->
  [Command|Params] = re:split(Data, "~", [{return, list}]),
  {list_to_existing_atom(Command), Params}.
