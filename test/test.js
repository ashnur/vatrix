require('better-stack-traces')
'use strict'
var vatrix = require('../')
    , expect = require('expect.js')
    , u = require('totemizer')
    , m = vatrix.m
    , r = vatrix.m.r
    , d = vatrix.drawMatrix
    ;

describe('vectors', function(){

    describe('matrix addition', function(){
        it('should add values of the same indeces together', function(){
            expect(vatrix.ma(vatrix([[1,2],[3,4]]), vatrix([[9,8],[7,6]]))).to
                .eql(vatrix([[10,10],[10,10]]))
        })
        it('should add values of the same indeces together', function(){
            expect(vatrix.ma(vatrix([[1,2],[3,4],[0,0]])
                            ,vatrix([[11,12],[21,22],[31,32]])
                            )).to
                .eql(vatrix([[12,14],[24,26],[31,32]]))

            expect(vatrix.ma(vatrix([[1,2,0],[3,4,0],[0,0,0]])
                            ,vatrix([[11,12,0],[21,22,0],[31,32,0]])
                            ,vatrix([[9,8,0],[7,6,0],[0,0,0]])
                            ,vatrix([[19,29,39],[49,59,69],[0,0,0]])
                            ,vatrix([[60,49,61],[20,9,31],[69,68,100]])
                            )).to
                .eql(vatrix([[100,100,100],[100,100,100],[100,100,100]]))
        })
    })

    describe('matrix subtraction', function(){
        it('should add values of the same indeces together', function(){
            expect(vatrix.ms(vatrix([[1,2],[3,4]]),vatrix([[9,8],[7,6]]))).to
                .eql(vatrix([[-8,-6],[-4,-2]]))
        })
        it('should add values of the same indeces together', function(){
            expect(vatrix.ms(vatrix([[1,2,0],[3,4,0],[0,0,0]])
                            ,vatrix([[11,12,0],[21,22,0],[31,32,0]])
                            ,vatrix([[9,8,0],[7,6,0],[0,0,0]])
                            ,vatrix([[19,29,39],[49,59,69],[0,0,0]])
                            ,vatrix([[60,49,61],[20,9,31],[69,68,100]])
                            )).to
                .eql(vatrix([[-98,-96,-100],[-94,-92,-100],[-100,-100,-100]]))
        })
    })

    describe('matrix multiplication with scalar value', function(){
        it('should multiply all the coefficients', function(){
            expect(vatrix.msm(vatrix([[1,2],[3,4]]),r(3))).to.eql(vatrix([[3,6],[9,12]]))
        })
    })
    describe('matrix transpose', function(){
        it('should return the dot product of the input vectors', function(){
            expect(vatrix.mt(vatrix([[1,3,5],[7,11,13]]))).to
                .eql(vatrix([[1,7],[3,11],[5,13]]))
        })
    })

    describe('matrix multiplication', function(){
        it('should return a vector ', function(){
            expect(vatrix.mm(vatrix([[15,25],[42,69]]), m([2,4]))).to.eql(m([130,360]))
        })
        it('should return a vector ', function(){
            expect(vatrix.mm(m([2,4]), vatrix([[15,25],[42,69]]))).to.eql(m([198,326]))
        })
        it('should return the result matrix', function(){
            expect(vatrix.mm(vatrix([[1,3],[5,7]]), vatrix([[2,4],[6,8]]))).to
                .eql(vatrix([[20,28],[52,76]]))
        })
        it('should return the result matrix', function(){
            expect(vatrix.mm(vatrix([[2,3,4],[5,6,7]]), vatrix([[1,8],[9,2],[3,4]]))).to
                .eql(vatrix([[41,38],[80,80]]))
        })
        it('should return the result matrix', function(){
            expect(vatrix.mm(vatrix([[1,3],[5,7],[11,13]]),vatrix([[17,19,23],[29,31,37]]))).to
                .eql(vatrix([[104,112,134],[288,312,374],[564,612,734]]))
        })
        it('should return the result matrix', function(){
            expect(vatrix.mm(vatrix([[1,3],[5,7],[11,13]]),vatrix([[17,19,23],[29,31,37]])
                        ,vatrix([[1,2],[3,4],[4,6]]))).to
                .eql(vatrix([[4*244,4*365],[4*680,4*1017],[4*1334,4*1995]]))
        })
    })

    describe('matrix echelon form', function(){
        function test(matrix){
            //console.log('ze matrix ------------------')
            //console.log(d(matrix))
            var e = vatrix.me(vatrix(matrix));
            //console.log('e echelon ------------------')
            //console.log(d(e[0]))
            //console.log('augmentation ------------------')
            //console.log(d(e[2]))
            expect(vatrix.isUpperTriangular(e[0])).to.equal(true)
        }
        it('should return an upper triangular matrix, and a sign change', function(){
            test([[3,7],[14,22]])
            test([[32, 551, 23],[391, 122, 123],[332, 13, 832]])
            test([[0,2],[1,0],[3,4]])
            test([[1,2],[1,-1],[3,4]])
            test([[32, 551, 23, 111],[391, 12, 122, 123],[2, 332, 13, 832]])
            test([[32, 551, 23], [111, 391, 12], [122, 123, 2], [332, 13, 832]])
        })
    })

    describe('matrix determinant', function(){
        it('should return the determinant', function(){
            expect(vatrix.md(vatrix([[3,0,5],[0,0,4],[0,9,3]]))).to.eql(r(-108))
            expect(vatrix.md(vatrix([[15,75],[60,24]]))).to.eql(r(-4140))
            expect(vatrix.md(vatrix([[15,75,2],[5,30,82],[45,90,6]]))).to.eql(r(164700))
            expect(vatrix.md(vatrix([[5,30,82],[15,75,2],[45,90,6]]))).to.eql(r(-164700))
            expect(vatrix.md(vatrix([[1,3,5],[2,4,7],[1,1,0]]))).to.eql(r(4))
        })
    })

    describe('matrix row reduce', function(){

        function test(matrix, expectation){
            matrix = vatrix(matrix)
            // console.log('original matrix ------------------')
            // console.log(d(matrix))
            var e = vatrix.mrr(matrix)
                , identity = e[0]
                , inverse  = e[1]
                , diagonal
                ;

            if ( identity.length === identity[0].length ) {
                //console.log('should be the identity ------------------')
                //console.log(d(identity))
                expect(vatrix.isIdentity(identity)).to.equal(true)
            }
            //console.log('should be the inverse ------------------')
            //console.log(d(inverse))

            if ( expectation ) {
                //console.log('the inverse ------------------')
                //console.log(d(expectation))
                expect(inverse).to.eql(expectation)
            }

            diagonal = vatrix.mm( inverse, matrix)
            //console.log('original * inverse should = identity ------------------')
            //console.log(d(diagonal))

            expect(vatrix.isDiagonal(diagonal)).to.be(true)


        }
        it('should return an identity and the inverse matrix of the input', function(){
            test([[3,7],[14,22]],[[r(-11,16),r(7,32)],[r(7,16),r(-3,32)]])
            test([[1,2],[1,-1],[3,4]])
            test([[0,2],[1,0],[3,4]])

            test([[1,-1, 3],[2,1,-1]],[[r(1,3),r(1,3)],[r(-2,3),r(1,3)]])
            test([[32, 551, 23],[391, 122, 123],[332, 13, 832]],
                vatrix.msd(vatrix([
                    [r(-99905),r(458133),r(-64967)]
                    ,[r(284476),r(-18988),r(-5057)]
                    ,[r(35421),r(-182516),r(211537)]
                ]), r(154363999) ))
            test([[32, 551, 23], [111, 391, 12], [122, 123, 2], [332, 13, 832]])
            test([[2, 2, 2, 2], [2, -2, 2, -2]])
        })

    })

    describe('spanning set', function(){
        it('returns true if the matrix is spanning', function(){
            expect(vatrix.isSpanning(vatrix([[1,2,-1],[2,0,4],[-1,1,3]]))).to.be(true)
            expect(vatrix.isSpanning(vatrix([[1,2,-1,3],[2,-1,8,1],[-3,4,17,1]]))).to.be(false)
            expect(vatrix.isSpanning(vatrix([[1,2,-1],[-1,1,0],[2,3,2]]))).to.be(true)
        })
    })
    describe('linear dependece', function(){
        it('returns true if the vectors are linearly dependent', function(){
            expect(vatrix.linearlyDependent(vatrix([[1,2,-1],[-1,1,0],[2,3,2]]))).to.be(true)
            expect(vatrix.linearlyDependent(vatrix([[1,0,0],[2,0,0],[3,5,0]]))).to.be(false)
        })
    })
})
