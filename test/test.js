void function(root){
    'use strict'
    var vatrix = require('../')
        , expect = require('expect.js')
        , rat = require('rationals')
        ;

    function times(nr, fun) {
        var result = []
            , i
            ;
        for ( i = 0; i < nr; i++) { result.push(fun(i)) }
        return result
    }

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

    function isUpperTriangular(matrix){
        var result = true;
        matrix.forEach(function(row_index){
            times(row_index, function(column_index){
                if ( matrix[row_index][column_index] !== 0 ) {
                    result = false
                }
            })
        })
        return result
    }

    function isLowerTriangular(matrix){
        return isUpperTriangular(vatrix.mt(matrix))
    }

    function isDiagonal(matrix){
        return isLowerTriangular(matrix) && isUpperTriangular(matrix)
    }

    function drawMatrix(matrix){
        return matrix.map(function(v,i){ return  v.join(' | ') }).join('\n')
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
        })
        describe('vector subtraction', function(){
            it('should add values of the same indeces together', function(){
                expect(vatrix.vs([1,3,5,7,11,13],[2,4,6,8,12,14])).to
                    .eql([-1,-1,-1,-1,-1,-1])
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

        describe('matrix subtraction', function(){
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

        describe('matrix multiplication with scalar value', function(){
            it('should multiply all the coefficients', function(){
                expect(vatrix.msm([[1,2],[3,4]],3)).to.eql([[3,6],[9,12]])
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
        describe('matrix determinant', function(){
            it('should return the determinant', function(){
                expect(vatrix.md([[3,0,5],[0,0,4],[0,9,3]])).to.eql(-108)
                expect(vatrix.md([[15,75],[60,24]])).to.eql(-4140)
                expect(vatrix.md([[15,75,2],[5,30,82],[45,90,6]])).to.eql(164700)
                expect(vatrix.md([[5,30,82],[15,75,2],[45,90,6]])).to.eql(-164700)
                expect(vatrix.md([[1,3,5],[2,4,7],[1,1,0]])).to.eql(4)
            })
        })
        describe('matrix echelon form', function(){
            function test(matrix){
                var e = vatrix.me(matrix);
                //console.log('ze matrix ------------------')
                //console.log(drawMatrix(matrix))
                //console.log('e echelon ------------------')
                //console.log(drawMatrix(e[0]))
                //console.log(' augmentation ------------------')
                //console.log(drawMatrix(e[2]))
                expect(isLowerTriangular(e[0]) && isUpperTriangular(e[2])).to.equal(true)
            }
            it('should return an upper a lower triangular matrix, and a sign change', function(){
                test([[3,7],[14,22]])
                test([[32, 551, 23],[391, 122, 123],[332, 13, 832]])
                test([[0,2],[1,0],[3,4]])
                test([[1,2],[1,-1],[3,4]])
                test([[32, 551, 23, 111],[391, 12, 122, 123],[2, 332, 13, 832]])
                test([[32, 551, 23], [111, 391, 12], [122, 123, 2], [332, 13, 832]])
            })
        })
    })
}(this)
