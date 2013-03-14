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
        var transposed = []
            , width = matrix.length
            , length = matrix[0].length
            , values = matrix.reduce(Array.prototype.concat)
            ;

        console.log(values)

        matrix.forEach(function(row, rowindex){
            row.forEach(function(elem, columnindex){
            })
        })
    }

    function matrix_multiplication(){
        return slice(arguments).reduce(function(p, c, i){
            return i === 0 ? c : p.map(function(prow, i){
                return c.map(function(pelem, j){
                    return pelem
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

    vatrix.matrixDeterminant = matrix_determinant
    vatrix.md = matrix_determinant

    if ( module !== undefined && module.exports ) {
        module.exports = vatrix
    } else {
        root.vatrix = vatrix
    }

}(this)
