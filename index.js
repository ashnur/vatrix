void function(root){
    'use strict'

    var u = require('totemizer')
        , m = require('momentum')
        , r = m.r
        , zero = r(0)
        , one = r(1)
        ;

    function is_identity(matrix){
        var result = true;
        matrix.forEach(function(row, row_index){
            if ( row_index < row.length && row[row_index] !== one )  {
                result = false
            }
        })
        return result
    }

    function is_upper_triangular(matrix){
        var result = true;
        matrix.forEach(function(row, row_index){
            if ( row_index < row.length ) {
                u.times(row_index, function(column_index){
                    if ( row[column_index] !== zero ) {
                        result = false
                    }
                })
            }
        })
        return result
    }

    function is_lower_triangular(matrix){
        return is_upper_triangular(vatrix.mt(matrix))
    }

    function is_diagonal(matrix){
        return is_lower_triangular(matrix) && isUpperTriangular(matrix)
    }


    function draw_matrix(matrix){
        return matrix.map(function(v,i){ return  v.join(' | ') }).join('\n')
    }

    // I am using underscores for internal functions
    // and camelCase for the API

    function interchange(arr, first, second){
        arr = arr.slice(0)
        var t = arr[first];
        arr[first] = arr[second]
        arr[second] = t
        return arr
    }

    function pivot_row(width, index){
        var row = m.zero_vector(width);
        row[index] = 1
        return row
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

    function gcd(matrix){
        return m.gcd(matrix.map(m.gcd))
    }

    function addition(){
        return u.slice(arguments).reduce(function(p, c, i){
            return u.zipWith(m.add, p, c)
        })
    }

    function scalar_multiplication(matrix, scalar){
        return matrix.map(function(vector){ return m.scale(vector, scalar) })
    }

    function scalar_division(matrix, scalar){
        return matrix.map(function(vector){ return scalar_division(vector, scalar) })
    }

    function subtraction(){
        return u.slice(arguments).reduce(function(p, c, i){
            return u.zipWith(m.sub, p, c)
        })
    }


    function transpose(matrix){
        var height = matrix[0].length-1
            , width = matrix.length-1
            ;
        return u.span(0, height).map(function(i){
            return u.span(0, width).map(function(j){
                return matrix[j][i]
            })
        })
    }


    function multiplication(){
        return u.slice(arguments).reduce(function(A, B, index){
            if ( ! Array.isArray(A[0]) ) A = [A]
            if ( ! Array.isArray(B[0]) ) B = u.partition(B, 1)
            var height = A.length-1
                , width = (B = transpose(B)).length-1
                , result = u.span(0, height).map(function(i){
                    return u.span(0, width).map(function(j){
                        return m.dot(A[i],B[j])
                    })
                })
                ;
            if ( result[0].length == 1) result = Array.prototype.concat.apply([],result)
            if ( result.length == 1 ) result = result[0]

            return result
        })
    }

    function pivotize(matrix){
        var size = matrix.length < matrix[0].length ? matrix.length : matrix[0].length
            , P = vatrix(identity_matrix(matrix.length > matrix[0].length ? matrix.length : matrix[0].length))
            , sign = 1
            , row_index
            , search
            ;

        for ( row_index = 0; row_index<size; row_index ++ ) {
            if ( matrix[row_index][row_index] === zero ) {
                for ( search = 0; search < size; search ++ ) {
                    if ( search !== row_index
                        && matrix[search][row_index] !== zero
                        && matrix[row_index][search] !== zero
                       ) {

                        P = interchange(P, row_index, search)
                        matrix = interchange(matrix, row_index, search)
                        sign *= -1
                        break
                    }
                }
            }
        }

        return [P, r(sign)]
    }

    function echelon(matrix){

        var width = matrix[0].length
            , height = matrix.length
            , pivotize_result = pivotize(matrix)
            , augmentation = pivotize_result[0]
            , change = pivotize_result[1]
            , echelon = multiplication(augmentation, matrix)
            ;


        echelon.forEach(function(row, row_index){
            u.times(row_index, function(column_index){
                var pivot, pivot_row, lead, multiple;

                pivot = echelon[column_index][column_index]
                lead = echelon[row_index][column_index]
//                multiple = r.lcm(pivot, lead)

//                if ( multiple ) {
//                    echelon[column_index] = m.scale(echelon[column_index], multiple.per(pivot))
//                    augmentation[column_index] = m.scale(augmentation[column_index], multiple.per(pivot))
                    echelon[row_index] = m.sub(echelon[row_index], m.scale(echelon[column_index],  lead.per(pivot)))
                    augmentation[row_index] = m.sub(augmentation[row_index], m.scale(augmentation[column_index],  lead.per(pivot)))

//
//                    echelon[row_index] = m.scale(echelon[row_index], multiple.per(lead))
//                    augmentation[row_index] = m.scale(augmentation[row_index], multiple.per(lead))
//
//                    change *= (multiple.per(pivot) * multiple.per(lead))
//
//                    pivot_row = echelon[column_index]
//                    echelon[row_index] = m.sub(echelon[row_index], pivot_row)
//                    augmentation[row_index] = m.sub(augmentation[row_index], pivot_row)
//                }
            })
        })
        return [echelon, change, augmentation]
    }

    function determinant(matrix){

        if ( matrix.length != matrix[0].length) throw new Error ('not a square matrix')

        var echelon = echelon(matrix);

        return u.times(echelon[0].length, function(row_index){
            return echelon[0][row_index][row_index]
        }).reduce(multiply) / echelon[1]

    }

    function fully_reduce(matrix){
        var echelon_result = echelon(matrix)
            , echelon = echelon_result[0]
            , change = echelon_result[1]
            , augmentation = echelon_result[2]
            ;

        echelon.forEach(function(row, row_index){
            var pivot = row[row_index];

        })
        return [echelon, augmentation]
    }

    function vatrix(arr){ return arr.map(m) }

    vatrix.m = m

    vatrix.matrixAddition = addition
    vatrix.ma = addition

    vatrix.matrixSubtraction = subtraction
    vatrix.ms = subtraction

    vatrix.matrixScalarMultiplication = scalar_multiplication
    vatrix.msm = scalar_multiplication

    vatrix.matrixTranspose = transpose
    vatrix.mt = transpose

    vatrix.matrixDeterminant = determinant
    vatrix.md = determinant

    vatrix.matrixMultiplication = multiplication
    vatrix.mm = multiplication

    vatrix.matrixRowEchelon = echelon
    vatrix.me = echelon

    vatrix.matrixRowReduce = fully_reduce
    vatrix.mrr = fully_reduce

    vatrix.drawMatrix = draw_matrix
    vatrix.isLowerTriangular = is_lower_triangular
    vatrix.isUpperTriangular = is_upper_triangular
    vatrix.isDiagonal = is_diagonal

    if ( module !== undefined && module.exports ) {
        module.exports = vatrix
    } else {
        root.vatrix = vatrix
    }

}(this)
