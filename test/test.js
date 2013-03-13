describe("vatrix", function(){
    var vatrix = require('../')
        , expect = require('expect.js')
        ;

    function rand(min, max){
        var r =  Math.floor(Math.random() * (max - min + 1)) + min;
        return  r == 0 ?  rand(max, min) : r
    }

    function getRandomArray(minLength, maxLength){

        var length = rand(maxLength || 6, minLength || 3)
            , common_factor = rand(13, -13)
            , arr=[]
            ;

        while ( maxLength-- > minLength ) {
            arr.push(rand(13, -13)*common_factor)
        }

        arr.push(rand(13, -13)*common_factor)

        return arr
    }


    it("should be an object", function(){expect(vatrix).to.be.an('object')})

    describe("vectors", function(){
        describe("scalar multiplication", function(){
            it("should multiply each element with the scalar", function(){
                expect(vatrix.vm([1,3,5,7,11,13],13)).to
                    .eql([13,39,65,91,143,169])
            })
            it("even if multiple scalars are provided", function(){
                expect(vatrix.vm([1,3,2],2,3,5)).to
                    .eql([30,90,60])
            })
        })
        describe("vector addition", function(){
            it("should add values of the same indeces together", function(){
                expect(vatrix.va([1,3,5,7,11,13],[2,4,6,8,12,14])).to
                    .eql([3,7,11,15,23,27])
            })
            it("missing or undefined values are considered zero", function(){
                expect(vatrix.va([1,3,5,7],[12,14])).to
                    .eql([13,17,5,7])
                expect(vatrix.va([1,3,5,7],[,,12,14])).to
                    .eql([1,3,17,21])
            })
        })
    })
})
