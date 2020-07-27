const server = require('../server');
const fs = require('fs');

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

    this.templateFile = fs.readFileSync('./template.html', (err, template) => {
        if (err) console.error(err);
        return template.file.toString();
    });

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

    it('should correctly append content to the template', function() {
        const combined = server.appendContentToTemplate(data);
        expect(combined).toBeDefined;
        expect(combined).toContain(data);
    });

});