const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

// Create an issue with every field: POST request to /api/issues/{project}
// Create an issue with only required fields: POST request to /api/issues/{project}
// Create an issue with missing required fields: POST request to /api/issues/{project}
// View issues on a project: GET request to /api/issues/{project}
// View issues on a project with one filter: GET request to /api/issues/{project}
// View issues on a project with multiple filters: GET request to /api/issues/{project}
// Update one field on an issue: PUT request to /api/issues/{project}
// Update multiple fields on an issue: PUT request to /api/issues/{project}
// Update an issue with missing _id: PUT request to /api/issues/{project}
// Update an issue with no fields to update: PUT request to /api/issues/{project}
// Update an issue with an invalid _id: PUT request to /api/issues/{project}
// Delete an issue: DELETE request to /api/issues/{project}
// Delete an issue with an invalid _id: DELETE request to /api/issues/{project}
// Delete an issue with missing _id: DELETE request to /api/issues/{project}

suite('Functional Tests', () => {

    let deletedId;

    suite('POST Tests', () => {

        test('Create an issue with every field: POST request to /api/issues/{project}', (done) => {
            chai
                .request(server)
                .post('/api/issues/projects')
                .send({
                    issue_title: 'POST Test 1 Title',
                    issue_text: 'POST Test 1 Text',
                    created_by: 'evg13ny',
                    assigned_to: 'me',
                    status_text: 'Not Done'
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    deletedId = res.body._id;
                    assert.equal(res.body.issue_title, 'POST Test 1 Title');
                    assert.equal(res.body.issue_text, 'POST Test 1 Text');
                    assert.equal(res.body.created_by, 'evg13ny');
                    assert.equal(res.body.assigned_to, 'me');
                    assert.equal(res.body.status_text, 'Not Done');
                    done();
                });
        });

        test('Create an issue with only required fields: POST request to /api/issues/{project}', (done) => {
            chai
                .request(server)
                .post('/api/issues/projects')
                .send({
                    issue_title: 'POST Test 2 Title',
                    issue_text: 'POST Test 2 Text',
                    created_by: 'evg13ny'
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.issue_title, 'POST Test 2 Title');
                    assert.equal(res.body.issue_text, 'POST Test 2 Text');
                    assert.equal(res.body.created_by, 'evg13ny');
                    done();
                });
        });

        test('Create an issue with missing required fields: POST request to /api/issues/{project}', (done) => {
            chai
                .request(server)
                .post('/api/issues/projects')
                .send({
                    issue_title: '',
                    issue_text: '',
                    created_by: ''
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, 'required field(s) missing');
                    done();
                });
        });

    })

    suite('GET Tests', () => {

        test('View issues on a project: GET request to /api/issues/{project}', (done) => {
            chai
                .request(server)
                .get('/api/issues/abcabc')
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.length, 2);
                    done();
                });
        });

        test('View issues on a project with one filter: GET request to /api/issues/{project}', (done) => {
            chai
                .request(server)
                .get('/api/issues/abcabc')
                .query({ _id: '647e3b278c9e972fe0b3cf3f' })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.deepEqual(res.body[0], {
                        '_id': '647e3b278c9e972fe0b3cf3f',
                        'issue_title': 'test1',
                        'issue_text': 'test1',
                        'created_on': '2023-06-05T19:44:39.357Z',
                        'updated_on': '2023-06-05T19:44:39.357Z',
                        'created_by': 'evg13ny',
                        'assigned_to': '',
                        'open': true,
                        'status_text': ''
                    });
                    done();
                });
        });

        test('View issues on a project with multiple filters: GET request to /api/issues/{project}', (done) => {
            chai
                .request(server)
                .get('/api/issues/abcabc')
                .query({
                    '_id': '647e3b338c9e972fe0b3cf45',
                    'issue_title': 'test2',
                    'issue_text': 'test2',
                    'created_by': 'evg13ny'
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.deepEqual(res.body[0], {
                        '_id': '647e3b338c9e972fe0b3cf45',
                        'issue_title': 'test2',
                        'issue_text': 'test2',
                        'created_on': '2023-06-05T19:44:51.311Z',
                        'updated_on': '2023-06-05T19:44:51.311Z',
                        'created_by': 'evg13ny',
                        'assigned_to': '',
                        'open': true,
                        'status_text': ''
                    });
                    done();
                });
        });

    });

    suite('PUT Tests', () => {

        test('Update one field on an issue: PUT request to /api/issues/{project}', (done) => {
            chai
                .request(server)
                .put('/api/issues/abcabcabc')
                .send({
                    _id: '647e31d45db4bfbea6d80c2c',
                    issue_title: 'test3',
                })
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.result, 'successfully updated');
                    assert.equal(res.body._id, '647e31d45db4bfbea6d80c2c');
                    done();
                });
        });

        test('Update multiple fields on an issue: PUT request to /api/issues/{project}', (done) => {
            chai
                .request(server)
                .put('/api/issues/abcabcabc')
                .send({
                    _id: '647e31e15db4bfbea6d80c32',
                    issue_title: 'test4',
                    issue_text: 'test4'
                })
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.result, 'successfully updated');
                    assert.equal(res.body._id, '647e31e15db4bfbea6d80c32');
                    done();
                });
        });

        test('Update an issue with missing _id: PUT request to /api/issues/{project}', (done) => {
            chai
                .request(server)
                .put('/api/issues/abcabcabc')
                .send({
                    issue_title: 'test5',
                })
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, 'missing _id');
                    done();
                });
        });

        test('Update an issue with no fields to update: PUT request to /api/issues/{project}', (done) => {
            chai
                .request(server)
                .put('/api/issues/abcabcabc')
                .send({
                    _id: '647e31e15db4bfbea6d80c32'
                })
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, 'no update field(s) sent');
                    assert.equal(res.body._id, '647e31e15db4bfbea6d80c32');
                    done();
                });
        });

        test('Update an issue with an invalid _id: PUT request to /api/issues/{project}', (done) => {
            chai
                .request(server)
                .put('/api/issues/abcabcabc')
                .send({
                    _id: '111',
                    issue_title: 'test3',
                })
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, 'could not update');
                    assert.equal(res.body._id, '111');
                    done();
                });
        });

    });

    suite('DELETE Tests', () => {

        test('Delete an issue: DELETE request to /api/issues/{project}', (done) => {
            chai
                .request(server)
                .delete('/api/issues/projects')
                .send({ _id: deletedId })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.result, 'successfully deleted');
                    assert.equal(res.body._id, deletedId)
                })
            done();
        });

        test('Delete an issue with an invalid _id: DELETE request to /api/issues/{project}', (done) => {
            chai
                .request(server)
                .delete('/api/issues/projects')
                .send({ _id: '111' })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, 'could not delete');
                });
            done();
        });

        test('Delete an issue with missing _id: DELETE request to /api/issues/{project}', (done) => {
            chai
                .request(server)
                .delete('/api/issues/projects')
                .send({ _id: '' })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, 'missing _id');
                });
            done();
        });

    });

});

after(() => {
    chai.request(server)
        .get('/');
});