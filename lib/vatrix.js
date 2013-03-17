void function(root){

    require('./sinful.js')

    var slice = Function.liberate(Array.prototype.slice)
        , vatrix = Object.create(null)
        , zippy = require('zippy')
        , zipWith = zippy.zipWith
        , zipWithArray = function(funct, argsArray){ return zipWith.apply(null,[funct].concat(argsArray)) }
        , r = require('rationals')
        ;

    // I am using underscores for internal functions
    // and camelCase for the API

    function array_max(arr) { return Math.max.apply(null, arr) }

    function is_int(v){ return v % 1 === 0 }

    function all_integers(arr){ return arr.every(is_int) }

    function add(p,c){ return p+c }

    function multiply(p,c){ return p*c }

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
        return (row_start).to(row_end).map(function(row){
            return (column_start).to(column_end).map(function(column){
                return matrix[row][column]
            })
        })
    }

    function matrix_expand(matrix, left, top, right, bottom){
        //matrix = matrix.slice(0)
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
        return vector.map(function(v, i){ return v * scalar })
    }

    function vector_addition(){
        return zipWithArray(function(p, c){return Number(p||0)+Number(c||0)}, slice(arguments))
    }

    function vector_subtraction(){
        return zipWithArray(function(p, c){return Number(p||0)-Number(c||0)}, slice(arguments))
    }

    function matrix_addition(){
        return slice(arguments).reduce(function(p, c, i){
            return i === 0 ? c : zipWith(vector_addition, p, c)
        })
    }

    function matrix_merge(){
        return slice(arguments).reduce(function(p, c, i){
            return i === 0 ? c : zipWith(function(){
                return zipWithArray(function(p, c){ return c === 0 ? p : c  }, slice(arguments))
            }, p, c)
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

    function matrix_pivotize(matrix){
        matrix = matrix.slice(0)
        var max = indexof_max(matrix_column(matrix, 0))
            , P = identity_matrix(matrix.length)
            ;
        if ( max !== 0 ) {
            P = interchange(P,0,max)
        }
        return P
    }


    function matrix_ludecomposition(matrix){

        var width = matrix[0].length
            , height = matrix.length
            , P = identity_matrix(width)
            , I = identity_matrix(width)
            , L
            , U = matrix.slice(0)
            ;

        L = matrix.map(function(row, row_index){
            return row.map(function(elem, column_index){
                return (row_index <= column_index
                            ? I[row_index][column_index]
                            : r(matrix[row_index][column_index],matrix[row_index-1][column_index]).val()
                       )
            })
        })

        U.forEach(function(row, row_index){
            (row_index).times(function(column_index){
                var pivot = column_index, pivot_row=row_index-1;
                console.log(pivot_row, pivot)
                U[row_index] = vector_subtraction(U[row_index], scalar_multiplication(U[pivot_row],L[row_index][pivot]))
            })
        })
        return [P,L,U]
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

    vatrix.matrixLUDecomposition = matrix_ludecomposition
    vatrix.mlu = matrix_ludecomposition

    if ( module !== undefined && module.exports ) {
        module.exports = vatrix
    } else {
        root.vatrix = vatrix
    }

}(this)
