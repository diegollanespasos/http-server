const http = require('http');
const handler = require('./src/handlers/index');

const PORT = 8087;

const myRouter = (path) => {
    const routes = {
        '/': handler.home,
        '/books': handler.books,
        '/file-viewer': handler.fileViewer,
        '/server-status': handler.serverStatus
    }
    if(routes[path]){
        return routes[path];
    }
    return handler.notFound;
}

const server = http.createServer((request, response) => {
    const route = myRouter(request.url.split('?')[0]);
    return route(request, response);
})

server.listen(PORT, () => console.log(`Server listening on PORT: ${PORT}`));