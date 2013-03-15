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

    function vector_addition(){
        return zipWithApply(function(p, c){return Number(p||0)+Number(c||0)}, slice(arguments))
    }

    function vector_subtraction(){
        return zipWithApply(function(p, c){return Number(p||0)-Number(c||0)}, slice(arguments))
    }

    function matrix_addition(){
        return slice(arguments).reduce(function(p, c, i){
            return i === 0 ? c : zipWith(vector_addition, p, c)
        })
    }

    function matrix_subtraction(){
        return slice(arguments).reduce(function(p, c, i){
            return i === 0 ? c : zipWith(vector_subtraction, p, c)
        })
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
            if ( ! Array.isArray(A[0]) ) A = [A]
            if ( ! Array.isArray(B[0]) ) B = B.partition(1)
            var height = A.length-1
                , width = (B = matrix_transpose(B)).length-1
                , result = (0).to(height).map(function(i){
                    return (0).to(width).map(function(j){
                        return vector_dot_product(A[i],B[j])
                    })
                })
                ;
            if ( result[0].length == 1) result = Array.prototype.concat.apply([],result)
            if ( result.length == 1 ) result = result[0]

            return result
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

    vatrix.vectorAddition = vector_addition
    vatrix.va = vector_addition

    vatrix.vectorSubtraction = vector_subtraction
    vatrix.vs = vector_subtraction


    vatrix.matrixAddition = matrix_addition
    vatrix.ma = matrix_addition

    vatrix.matrixSubtraction = matrix_subtraction
    vatrix.ms = matrix_subtraction

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
