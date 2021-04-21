const fs = require('fs');
const os = require('os');

const home = (request, response) => {
    response.writeHead(200, {'Content-Type': 'text/html'});
    const html = fs.readFileSync('./src/public/index.html', 'utf-8');
    response.write(html);
    response.end;
}

const notFound = ((request, response) => {
    response.writeHead(404, {'Content-Type': 'text/html'});
    const html = fs.readFileSync('./src/public/404.html', 'utf-8');
    response.write(html);
    response.end;
})

const books = ((request, response) => {
    switch(request.method) {
        case 'GET':
        const books = fs.readFileSync('./src/public/books.txt', 'utf-8');
        response.writeHead(200, {'Content-Type': 'application/json'});
        response.write(books);
        response.end();
        break;

        case 'POST':
        let data = '';
        request.on('data', chunk => {
            data += chunk;
         })
        request.on('end', () => {
            fs.writeFileSync('./src/public/books.txt', `${data},\n`, { encoding: 'utf-8', flag: 'a' } );
            response.writeHead(200, {'Content-Type': 'text/plain'});
            response.write('Book added');
            response.end();
        })
        break;

        case 'DELETE':        
            fs.writeFileSync('./src/public/books.txt', '');
            response.writeHead(200, {'Content-Type': 'text/plain'});
            response.write('Books deleted');
            response.end();
            break;

        default:
        break;
    }
})

/*
Syntax to display a file content from an internal directory:
    http://localhost:8087/file-viewer?file=FILE_NAME
*/
const fileViewer = (request, response) => {
    try{
        const url = new URL(`${request.headers.host}${request.url}`);
        const queryParameter = url.searchParams.get('file');
        const file = fs.readFileSync(`./src/public/internalDirectory/${queryParameter}`, 'utf-8');
        response.writeHead(200, {'Content-Type': 'text/plain'});
        response.write(file);
        response.end();
    } catch(e) {
        notFound(request, response);
    }
}

const serverStatus = (request, response) => {
    const serverInfo = {
        hostName: os.hostname(),
        cpus: os.cpus(),
        architecture: os.arch(),
        uptime: os.uptime(),
        userInfo: os.userInfo(),
        memoryAvailable: os.freemem()
    }

    response.writeHead(200, {'Content-Type': 'application/json'});
    response.write(JSON.stringify(serverInfo));
    response.end();
}

module.exports = {
    home,
    notFound,
    books,
    fileViewer,
    serverStatus
}