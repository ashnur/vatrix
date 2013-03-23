void function(root){
    'use strict'

    var liberate = Function.prototype.bind.bind(Function.prototype.call)
        , slice = liberate(Array.prototype.slice)
        , vatrix = Object.create(null)
        , r = require('rationals')
        , zip = zipWith.bind(null, function(){return slice(arguments)})
        ;

    function times(nr, fun) {
        var result = []
            , i
            ;
        for ( i = 0; i < nr; i++) { result.push(fun(i)) }
        return result
    }

    function longest(){
        var args = slice(arguments)
            , result = []
            ;

        times(args.length, function(i){
            var arr = args[i];
            result = args[i] ? (result.length > args[i].length ? result : args[i]) : []
        })
    }

    function span(init, limit, stepper) {

        var list = []
            ,i = init.valueOf()
            , continuePred
            ;

        stepper = stepper || function (x) { return x + 1; }

        continuePred = (stepper(i) > i) ? function (x) { return x <= limit }
                                        :  function (x) { return x >= limit }

        while (continuePred(i)) {
            list.push(i)
            i = stepper(i)
        }

        return list
    }

    function zipWith(){
        var fxn = arguments[0]
            , args = slice(arguments,1)
            , output = []
            , width = Math.max.apply(null, args.map(function(xs){ return xs ? (xs.length || 0) : 0 }))
            , i
            ;

        for (i = 0; i < width; i++) {
            output.push(fxn.apply(null, [].map.call(args, function(xs) {
                return xs ? xs[i] : []
            })))
        }
        return output
    }

    function zipWithArray(funct, argsArray){
        return zipWith.apply(null,[funct].concat(argsArray))
    }

    function partition(arr, length){

        var result, each;

        if (typeof length === 'undefined' || length <= 0) { return [] }

        result = []
        each   = []

        arr.forEach(function (value) {

            each.push(value)

            if (each.length === length) {
                result.push(each)
                each = []
            }

        })

        return result.concat(each.length > 0 ? [ each ] : [])
    }

    // I am using underscores for internal functions
    // and camelCase for the API

    function array_max(arr) { return Math.max.apply(null, arr) }

    function is_int(v){ return v % 1 === 0 }

    function all_integers(arr){ return arr.every(is_int) }

    function add(p,c){ p=p||0; c=c||0; return p.plus ? p.plus(c) : Number(p)+Number(c) }

    function subtract(p,c){ p=p||0; c=c||0; return p.minus ? p.minus(c) : Number(p)-Number(c) }

    function multiply(p,c){ p=p||0; c=c||0; return p.times ? p.times(c) : Number(p)*Number(c) }

    function divide(p,c){ p=p||0; c=c||0; return p.per ? p.per(c) : Number(p)/Number(c) }

    function interchange(arr, first, second){
        arr = arr.slice(0)
        var t = arr[first];
        arr[first] = arr[second]
        arr[second] = t
        return arr
    }

    function zero_vector(size){
        var vector = [];
        while ( size-- > 0 ) { vector.push(0) }
        return vector
    }

    function pivot_row(width, index){
        var row = zero_vector(width);
        row[index] = 1
        return row
    }

    function indexof_max(arr){
        return arr.reduce(function (m, e, i, a) { return (m==-1 || Math.abs(e) > Math.abs(a[m])) ? i : m }, -1)
    }

    function identity_matrix(n){
        var I = [], i=0;
        while ( i < n ) I.push(pivot_row(n,i++))
        return I
    }

    function empty_matrix(width, height){
        var Ø = [], i=0, j;
        while ( i++ < height ) { j = 0; while ( j++ < width ) { Ø.push(0) } }
        return Ø
    }

    function matrix_column(matrix, index){
        return matrix.map(function(row){ return row[index] })
    }

    function matrix_slice(matrix, row_start, column_start, row_end, column_end){
        row_end = row_end || matrix.length-1
        column_end = column_end || matrix[0].length-1
        if ( row_start > row_end || column_start > column_end ) return []
        return span(row_start, row_end).map(function(row){
            return span(column_start, column_end).map(function(column){
                return matrix[row][column]
            })
        })
    }

    function matrix_expand(matrix, left, top, right, bottom){
        top = top || 0
        bottom = bottom || 0
        left = left || 0
        right = right || 0
        var width = left + matrix[0].length + right;
        return empty_matrix(width, top).concat(matrix.map(function(v,row){
            return zero_vector(left).concat(v).concat(zero_vector(right))
        })).concat(empty_matrix(width,0))

    }

    function vector_dot_product(){
        return zipWithArray(
            function(){return slice(arguments).reduce(multiply)}
            , slice(arguments)
        ).reduce(add)
    }

    function vector_cross_product(){ throw new Error('not implemented') }

    function scalar_multiplication(vector, scalar){
        return vector.map(function(v, i){ return multiply(v,scalar) })
    }

    function vector_addition(){
        return zipWithArray(function(p, c){return add(p, c)}, slice(arguments))
    }

    function vector_subtraction(){
        return zipWithArray(function(p, c){return subtract(p, c)}, slice(arguments))
    }


    function matrix_rationalize(matrix){
        return matrix.map(function(row){
            return row.map(function(elem){ return r.checkInput(elem) })
        })
    }

    function matrix_addition(){
        return slice(arguments).reduce(function(p, c, i){
            return zipWith(vector_addition, p, c)
        })
    }

    function matrix_scalar_multiplication(matrix, scalar){
        return matrix.map(function(vector){
            return scalar_multiplication(vector, scalar)
        })
    }

    function matrix_subtraction(){
        return slice(arguments).reduce(function(p, c, i){
            return zipWith(vector_subtraction, p, c)
        })
    }


    function matrix_transpose(matrix){
        var height = matrix[0].length-1
            , width = matrix.length-1
            ;
        return span(0, height).map(function(i){
            return span(0, width).map(function(j){
                return matrix[j][i]
            })
        })
    }


    function matrix_multiplication(){
        return slice(arguments).reduce(function(A, B, index){
            if ( ! Array.isArray(A[0]) ) A = [A]
            if ( ! Array.isArray(B[0]) ) B = partition(B, 1)
            var height = A.length-1
                , width = (B = matrix_transpose(B)).length-1
                , result = span(0, height).map(function(i){
                    return span(0, width).map(function(j){
                        return vector_dot_product(A[i],B[j])
                    })
                })
                ;
            if ( result[0].length == 1) result = Array.prototype.concat.apply([],result)
            if ( result.length == 1 ) result = result[0]

            return result
        })
    }

    function matrix_pivotize(matrix){
        var size = matrix.length > matrix[0].length ? matrix.length : matrix[0].length
            , P = identity_matrix(size)
            , matrix = matrix_multiplication(P,matrix)
            , sign = 1
            , row_index
            , search
            ;

        for ( row_index = 0; row_index<size; row_index ++ ) {
            if ( matrix[row_index][row_index] === 0 ) {
                for ( search = 0; search < size; search ++ ) {
                    if ( search !== row_index
                        && matrix[search][row_index] !== 0
                        && matrix[row_index][search] !== 0
                       ) {

                        P = interchange(P, row_index, search)
                        matrix = interchange(matrix, row_index, search)
                        sign *= -1
                        break
                    }
                }
            }
        }

        return [P, sign]
    }


    function matrix_echelon(matrix){

        var width = matrix[0].length
            , height = matrix.length
            , pivotize_result = matrix_pivotize(matrix)
            , augmentation = matrix_rationalize(pivotize_result[0])
            , change = pivotize_result[1]
            , echelon = matrix_multiplication(augmentation, matrix_rationalize(matrix))
            ;


        echelon.forEach(function(row, row_index){
            times(row_index, function(column_index){
                var pivot, pivot_row, l;

                pivot = echelon[column_index][column_index]
                pivot_row = echelon[column_index]
                l = echelon[row_index][column_index].per(pivot)

                echelon[row_index] = vector_subtraction( echelon[row_index] , scalar_multiplication(pivot_row, l))
                augmentation[row_index] = vector_subtraction( augmentation[row_index] , scalar_multiplication(pivot_row, l))
            })
        })
        return [echelon, change, augmentation]
    }

    function matrix_determinant(matrix){

        if ( matrix.length != matrix[0].length) throw new Error ('not a square matrix')

        var echelon = matrix_echelon(matrix);

        return times(echelon[0].length, function(row_index){
            return echelon[0][row_index][row_index]
        }).reduce(function(p, c, i ){ return p.times(c) }).times(echelon[1]).val()

    }

    function matrix_fully_reduce(matrix){
        var echelon_result = matrix_echelon(matrix)
            , echelon = echelon_result[0]
            , change = echelon_result[1]
            , augmentation = echelon_result[2]
            ;

        console

        return [echelon, augmentation]
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

    vatrix.matrixScalarMultiplication = matrix_scalar_multiplication
    vatrix.msm = matrix_scalar_multiplication

    vatrix.matrixTranspose = matrix_transpose
    vatrix.mt = matrix_transpose

    vatrix.matrixDeterminant = matrix_determinant
    vatrix.md = matrix_determinant

    vatrix.matrixMultiplication = matrix_multiplication
    vatrix.mm = matrix_multiplication

    vatrix.matrixRowEchelon = matrix_echelon
    vatrix.me = matrix_echelon

    vatrix.matrixRowReduce = matrix_fully_reduce
    vatrix.mrr = matrix_fully_reduce

    if ( module !== undefined && module.exports ) {
        module.exports = vatrix
    } else {
        root.vatrix = vatrix
    }

}(this)
