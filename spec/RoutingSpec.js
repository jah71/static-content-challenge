let server = require('../server');
const request = require('supertest');

describe('Routing', function() {

    const data = '<p>test</p>';

    const mockResponse = {
        status: function(httpStatus) {
            return this;
        },
        send: function() {
            return this;
        }
    }

    beforeAll(function() {
        spyOn(mockResponse, 'status').and.callThrough();
        spyOn(mockResponse, 'send');
    });

    it('should return a 404 error if the resource doesn`t exist', function() {
        server.processContent({code: 'ENOENT'}, undefined, mockResponse);

        expect(mockResponse.status).toHaveBeenCalledWith(404);
        expect(mockResponse.send).toHaveBeenCalled();
    });

    it('should return a 200 when the resource does exist', function() {
        server.processContent(undefined, data, mockResponse);
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.send).toHaveBeenCalled();
    });

    it('should contain the correct content', function() {
        spyOn(server, 'appendContentToTemplate');
        server.processContent(undefined, data, mockResponse);
        expect(server.appendContentToTemplate).toHaveBeenCalled();
    });

});