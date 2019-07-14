
let chai = require("chai")
let chaiHttp = require("chai-http")
let server = require("../index")
let should = chai.should()
const Datastore = require('nedb-promises')
chai.use(chaiHttp)
describe("All APIs", () => {
    //SUCCESS TEST CASE
    describe("/POST api/removeAll", () => {
		it("it should remove all entries", done => {
			chai
				.request(server)
                .post("/api/removeAll")
				.end((err, res) => {
                    res.should.have.status(200)
					done()
				})
		})
	})
    describe("/POST api/add", () => {
		it("it should add new website => https://instagram.com", done => {
			chai
				.request(server)
                .post("/api/add")
                .send({
                    name:'https://instagram.com'
                })
				.end((err, res) => {
                    res.should.have.status(200)
					done()
				})
		})
	})
	describe("/GET api/getAll", () => {
		it("it should GET all the website list", done => {
			chai
				.request(server)
				.get("/api/getAll")
				.end((err, res) => {
                    res.should.have.status(200)
					res.body.data.length.should.be.eql(1)
					done()
				})
		})
	})
    //FAIL TEST CASE
    describe("/POST api/removeAll", () => {
		it("it should remove all entries", done => {
			chai
				.request(server)
                .post("/api/removeAll")
				.end((err, res) => {
                    res.should.have.status(200)
					done()
				})
		})
	})
    describe("/POST api/add", () => {
		it("it should add new website => https://instagram.com", done => {
			chai
				.request(server)
                .post("/api/add")
                .send({
                    name:'https://instagram.com'
                })
				.end((err, res) => {
                    res.should.have.status(200)
					done()
				})
        })
        it("it should failed to add same website => https://instagram.com", done => {
			chai
				.request(server)
                .post("/api/add")
                .send({
                    name:'https://instagram.com'
                })
				.end((err, res) => {
                    res.should.have.status(500)
					done()
				})
		})
        it("it should failed to add invalid url => google.com", done => {
			chai
				.request(server)
                .post("/api/add")
                .send({
                    name:'google.com'
                })
				.end((err, res) => {
                    res.should.have.status(500)
					done()
				})
		})
	})
})
