void function(root){

    require('./sinful.js')

    var slice = Function.liberate(Array.prototype.slice)
        , vatrix = Object.create(null)
        , zippy = require('zippy')
        , zipWith = zippy.zipWith
        , zipWithApply = function(funct, argsArray){ return zipWith.apply(null,[funct].concat(argsArray)) }
        , r = require('rationals')
        ;

    // I am using underscores for internal functions
    // and camelCase for the API

    function is_int(v){ return v % 1 === 0 }

    function all_integers(arr){ return arr.every(is_int) }

    function sum(p,c){ return p+c }
    function multiply(p,c){ return p*c }

    function vector_dot_product(){
        return zipWithApply(
            function(){return slice(arguments).reduce(multiply)}
            , slice(arguments)
        ).reduce(sum)
    }

    function vector_cross_product(){ throw new Error('not implemented') }

    function scalar_multiplication(vector, scalar){
        return vector.map(function(v, i){ return v * scalar })
    }

    function addition(){
        return zipWithApply(function(p, c){return (p||0)+(c||0)}, slice(arguments))
    }

    function subtraction(){
        return zipWithApply(function(p, c){return (p||0)-(c||0)}, slice(arguments))
    }

    function matrix_transpose(matrix){
        var height = matrix[0].length-1
            , width = matrix.length-1
            ;
        return (0).to(height).map(function(i){
            return (0).to(width).map(function(j){
                return matrix[j][i]
            })
        })
    }

    function matrix_multiplication(){
        return slice(arguments).reduce(function(A, B, index){
            if ( index === 0 ) return B
            var height = A.length-1
                , width = (B = matrix_transpose(B)).length-1
                ;

            return (0).to(height).map(function(i){
                return (0).to(width).map(function(j){
                    return vector_dot_product(A[i],B[j])
                })
            })
        })
    }

    function matrix_determinant(matrix){
        var size = Math.sqrt(matrix.length)
            , i
            ;
        if ( ! is_int(size) ) throw new Error ('not a square matrix')

    }

    vatrix.vectorScalarMultiplication = scalar_multiplication
    vatrix.vsm = scalar_multiplication

    vatrix.vectorDotProduct = vector_dot_product
    vatrix.vdp = vector_dot_product

    vatrix.vectorAddition = addition
    vatrix.va = addition

    vatrix.vectorSubtraction = subtraction
    vatrix.vs = subtraction

    vatrix.matrixTranspose = matrix_transpose
    vatrix.mt = matrix_transpose

    vatrix.matrixDeterminant = matrix_determinant
    vatrix.md = matrix_determinant

    vatrix.matrixMultiplication = matrix_multiplication
    vatrix.mm = matrix_multiplication

    if ( module !== undefined && module.exports ) {
        module.exports = vatrix
    } else {
        root.vatrix = vatrix
    }

}(this)
