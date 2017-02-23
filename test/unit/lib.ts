export function respondJson(route: string, content?: any, statusCode?: number): any {
  let [method, endpoint] = route.split(' ')
  let reqPointer: any = {};

  this.respondWith(method, `api/${endpoint}.json`, function(request: any) {
    let body = null;
    try { body = JSON.parse(request.requestBody); } catch (e) {}
    reqPointer.body = body;
    reqPointer.headers = request.requestHeaders;
    reqPointer.url = request.url;
    reqPointer.method = request.method;
    
    request.respond(
      statusCode || 200,
      { 'Content-Type': 'application/json' },
      JSON.stringify(content || null)
    );
  });

  return reqPointer;
}