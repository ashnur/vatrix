void function(root){

    require('./sinful.js')

    var slice = Function.liberate(Array.prototype.slice)
        , vatrix = Object.create(null)
        , zippy = require('zippy')
        ;

    // I am using underscores for internal functions
    // and camelCase for the API

    function is_int(v){ return v % 1 === 0 }

    function all_integers(arr){ return arr.every(isInt) }

    function vector_cross_product(){ throw new Error('not implemented') }

    function vector_scalar_multiplication(vector, scalar){
        return vector.map(function(v, i){ return v * scalar })
    }

    function vector_multiply(){
        var args = slice(arguments)
            ;

        return args.reduce(function(p, c, i){
            return i === 0 ? c
                           : Array.isArray(p) ? Array.isArray(c)
                                                ? vector_cross_product(p, c)
                                                : vector_scalar_multiplication(p, c)
                                              : Array.isArray(c)
                                                ? vector_scalar_multiplication(c, p)
                                                : p*c
        })
    }

    function vector_addition(){
        return zippy.zipWith.apply(null, [function(p, c){return (p||0)+(c||0)}].concat(slice(arguments)))
    }

    vatrix.vectorMultiply = vector_multiply
    vatrix.vm = vector_multiply

    vatrix.vectorAddition = vector_addition
    vatrix.va = vector_addition

    if ( module !== undefined && module.exports ) {
        module.exports = vatrix
    } else {
        root.vatrix = vatrix
    }

}(this)
