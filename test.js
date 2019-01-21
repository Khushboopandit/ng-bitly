const expect = require('chai').expect
const axios = require('axios')

describe("API Tests", function() {
  let id, hash,hits;
  describe("/shorten", function() {
    
    it("should return a shortened URL", (done) => {
        const request = { url: "https://google.com" }
        axios.post('http://localhost:7000/shorten', request)
          .then(response => {
              id = response.data._id
              hash = response.data.hash
              hits = response.data.hits
              expect(response.status).to.equal(201)
              expect(response.data._id).to.be.ok
              expect(response.data.hash).to.be.ok;
              done()
          })
    });
    it("should return the same shortened URL for the earlier url", (done) => {
        const request = { url: "https://google.com" }
        axios.post('http://localhost:7000/shorten', request)
        .then(response => {
            expect(response.status).to.equal(201)
            expect(response.data._id).to.equal(id)
            expect(response.data.hash).to.equal(hash)
            done()
        })
    });

    it.only("should return a another shortened URL if maxHits exits", (done) => {
      const request1 = { url: "https://web.flock.com/?" }
      let hash
      axios.post('http://localhost:7000/shorten', request1)
      .then(response1 => {
        expect(response1.status).to.equal(201)
        hash = response1.data.hash
        const request2 = { url: "https://web.flock.com/?" , maxHits: 3}
        return axios.post('http://localhost:7000/shorten', request2)
        
        })
        .then(response2=>{
          expect(response2.data.hash).to.not.equal(hash)
          const request3 = { url: "https://web.flock.com/?" }
          return axios.post('http://localhost:7000/shorten', request3)
     
        })
        .then(response3=>{
          expect(response3.data.hash).to.equal(hash)
          done()
        })
    });
  });


  describe("/hits", function() {
    it("it should return the hits", (done) => {
      axios.get("http://localhost:7000/hits?hash="+hash)
        .then(response => {
          expect(response.data.hits).to.equal(hits)
          done()
        })
    })
  })

  describe("/:hash", function() {
  
    it("should redirect the user for an existing hash", (done) => {
      axios.get("http://localhost:7000/"+hash)
        .then(response => {
          expect(response.data).to.contain("google.com")
          done()
        })
  
    })

    it("hits for the url if its increamenting",(done)=>{
      const request = { url: "https://google.com" }
        axios.post('http://localhost:7000/shorten', request)
        .then(response => {
          expect(response.data.hits).to.equal(hits+1)
          done()
        })
    })
    
    it("hits for the url if its increamenting",(done)=>{
      const randomHash = "cjdhjckh73"
      axios.get("http://localhost:7000/"+randomHash)
        .catch(err => {
          expect(err.response.status).to.equal(404)
          done()
        })
    })
  })

  
});