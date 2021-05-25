require('net').createServer(function(sock) {
    sock.on('data', function(data) {
        sock.write('HTTP/1.1 200 OK\r\n');
        sock.write('Transfer-Encoding: chunked\r\n');
        sock.write('\r\n');

        setTimeout(() => {
            sock.write('b\r\n');
            sock.write('01234567890\r\n');

            sock.write('0\r\n');
            sock.write('\r\n');            
        }, 5000);

        sock.write('5\r\n');
        sock.write('12345\r\n');
    });
}).listen(9090, '127.0.0.1');