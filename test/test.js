describe('vatrix', function(){
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


    it('should be an object', function(){expect(vatrix).to.be.an('object')})

    describe('vectors', function(){
        describe('multiplication with a scalar value', function(){
            it('should multiply each element with the scalar', function(){
                expect(vatrix.vsm([1,3,5,7,11,13],13)).to
                    .eql([13,39,65,91,143,169])
            })
        })
        describe('vector addition', function(){
            it('should add values of the same indeces together', function(){
                expect(vatrix.va([1,3,5,7,11,13],[2,4,6,8,12,14])).to
                    .eql([3,7,11,15,23,27])
            })
            it('missing or undefined values are considered zero', function(){
                expect(vatrix.va([1,3,5,7],[12,14])).to
                    .eql([13,17,5,7])
                expect(vatrix.va([1,3,5,7],[,,12,14])).to
                    .eql([1,3,17,21])
            })
        })
        describe('vector subtraction', function(){
            it('should add values of the same indeces together', function(){
                expect(vatrix.vs([1,3,5,7,11,13],[2,4,6,8,12,14])).to
                    .eql([-1,-1,-1,-1,-1,-1])
            })
            it('missing or undefined values are considered zero', function(){
                expect(vatrix.vs([1,3,5,7],[12,14])).to
                    .eql([-11,-11,5,7])
                expect(vatrix.vs([1,3,5,7],[,,12,14])).to
                    .eql([1,3,-7,-7])
            })
        })
        describe('dot product', function(){
            it('should return the dot product of the input vectors', function(){
                expect(vatrix.vdp([1,3,5],[7,11,13])).to
                    .eql(105)
            })
            it('even with more than two vectors', function(){
                expect(vatrix.vdp([ 1, 3, 7,11,13]
                                 ,[ 7,11,13, 1, 3]
                                 ,[ 3, 7, 1,13,11]
                                 ,[11,13, 3, 7, 1]
                                 ,[13, 1,11, 3, 7]
                                 )).to
                    .eql(3*5*7*11*13)
            })
        })

        describe('matrix addition', function(){
            it('should add values of the same indeces together', function(){
                expect(vatrix.ma([[1,2],[3,4]],[[9,8],[7,6]])).to
                    .eql([[10,10],[10,10]])
            })
            it('should add values of the same indeces together', function(){
                expect(vatrix.ma([[1,2],[3,4]]
                                ,[[11,12],[21,22],[31,32]]
                                ,[[9,8],[7,6]]
                                ,[[19,29,39],[49,59,69]]
                                ,[[60,49,61],[20,9,31],[69,68,100]]
                                )).to
                    .eql([[100,100,100],[100,100,100],[100,100,100]])
            })
        })

        describe('matrix addition', function(){
            it('should add values of the same indeces together', function(){
                expect(vatrix.ms([[1,2],[3,4]],[[9,8],[7,6]])).to
                    .eql([[-8,-6],[-4,-2]])
            })
            it('should add values of the same indeces together', function(){
                expect(vatrix.ms([[1,2],[3,4]]
                                ,[[11,12],[21,22],[31,32]]
                                ,[[9,8],[7,6]]
                                ,[[19,29,39],[49,59,69]]
                                ,[[60,49,61],[20,9,31],[69,68,100]]
                                )).to
                    .eql([[-98,-96,-100],[-94,-92,-100],[-100,-100,-100]])
            })
        })

        describe('matrix transpose', function(){
            it('should return the dot product of the input vectors', function(){
                expect(vatrix.mt([[1,3,5],[7,11,13]])).to
                    .eql([[1,7],[3,11],[5,13]])
            })
        })

        describe('matrix multiplication', function(){
            it('should return a vector ', function(){
                expect(vatrix.mm([[15,25],[42,69]], [2,4])).to.eql([130,360])
            })
            it('should return a vector ', function(){
                expect(vatrix.mm([2,4], [[15,25],[42,69]])).to.eql([198,326])
            })
            it('should return the result matrix', function(){
                expect(vatrix.mm([[1,3],[5,7]], [[2,4],[6,8]])).to
                    .eql([[20,28],[52,76]])
            })
            it('should return the result matrix', function(){
                expect(vatrix.mm([[2,3,4],[5,6,7]], [[1,8],[9,2],[3,4]])).to
                    .eql([[41,38],[80,80]])
            })
            it('should return the result matrix', function(){
                expect(vatrix.mm([[1,3],[5,7],[11,13]],[[17,19,23],[29,31,37]])).to
                    .eql([[104,112,134],[288,312,374],[564,612,734]])
            })
            it('should return the result matrix', function(){
                expect(vatrix.mm([[1,3],[5,7],[11,13]],[[17,19,23],[29,31,37]],[[1,2],[3,4],[4,6]])).to
                    .eql([[4*244,4*365],[4*680,4*1017],[4*1334,4*1995]])
            })
        })
        describe('describe matrix LU decomposition', function(){
            it('should return the resultant matrices from the LU decomposition in order P,L,U', function(){
                expect(vatrix.mlu([[1,3,5],[2,4,7],[1,1,0]])).to
                    .eql([
                             [[0,1,0],[1,0,0],[0,0,1]]
                            ,[[1,0,0],[3,1,0],[9,12,1]]
                            ,[[5,30,82],[0,-15,-244],[0,0,2196]]
                         ])
                expect(vatrix.mlu([[15,75,2],[5,30,82],[45,90,6]])).to
                    .eql([
                             [[0,1,0],[1,0,0],[0,0,1]]
                            ,[[1,0,0],[3,1,0],[9,12,1]]
                            ,[[5,30,82],[0,-15,-244],[0,0,2196]]
                         ])
            })
        })
    })
})
