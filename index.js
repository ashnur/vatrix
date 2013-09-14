void function(root){
    'use strict'

    var u = require('totemizer')
        , m = require('momentum')
        , equal = require('deep-equal')
        , r = m.r
        , zero = r(0)
        , one = r(1)
        ;

    function is_identity(matrix){
        return matrix.length === matrix[0].length && matrix.every(function(row, row_index){
            return row.every(function(elem, column_index){
                return row_index === column_index ? elem === one : elem === zero
            })
        })
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
        return is_lower_triangular(matrix) && is_upper_triangular(matrix)
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

    function gcd(matrix){ return m.gcd(matrix.map(m.gcd)) }

    function addition(){
        return u.slice(arguments).reduce(function(p, c, i){
            return u.zipWith(m.add, p, c)
        })
    }

    function scalar_multiplication(matrix, scalar){
        return matrix.map(function(vector){ return m.scale(vector, scalar) })
    }

    function scalar_division(matrix, scalar){
        return matrix.map(function(vector){ return m.disperse(vector, scalar) })
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
        var width = matrix[0].length
            , length = matrix.length
            , P = vatrix(identity_matrix(length))
            , sign = 1
            , row_index
            , search

            ;

        for ( row_index = 0; row_index<length; row_index ++ ) {
            if ( matrix[row_index][row_index] === zero ) {
                for ( search = 0; search < length; search ++ ) {
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

    function row_echelon(matrix){

        var width = matrix[0].length
            , height = matrix.length
            , pivotize_result = pivotize(matrix)
            , augmentation = pivotize_result[0]
            , change = pivotize_result[1]
            , echelon = multiplication(augmentation, matrix)
            , scalar
            , gcd
            ;


        echelon.forEach(function(row, row_index){
            u.times(row_index, function(column_index){
                var pivot, pivot_row, lead, multiple;

                pivot = echelon[column_index][column_index]
                lead = echelon[row_index][column_index]
                scalar = lead.per(pivot)

                echelon[row_index] = m.sub(echelon[row_index]
                    , m.scale(echelon[column_index],  scalar))

                augmentation[row_index] = m.sub(augmentation[row_index]
                    , m.scale(augmentation[column_index],  scalar))

            })
        })
        return [echelon, change, augmentation]
    }

    function determinant(matrix){

        if ( matrix.length != matrix[0].length) throw new Error ('not a square matrix')

        var echelon = row_echelon(matrix);

        return u.times(echelon[0].length, function(row_index){
            return echelon[0][row_index][row_index]
        }).reduce(r.mul).per(echelon[1])

    }

    function fully_reduce(matrix){
        var echelon_result = row_echelon(matrix)
            , echelon = echelon_result[0]
            , change = echelon_result[1]
            , augmentation = echelon_result[2]
            , height = echelon.length
            , width = echelon[0].length
            , size = width < height ? width : height
            , column_index = size
            , row_index = column_index-1
            , target
            ;

        // make the diagonal 1
        u.times(width < height ? width : height, function(row_index){
            var row = echelon[row_index];
            echelon[row_index] = m.disperse(echelon[row_index], row[row_index])
            augmentation[row_index] = m.disperse(augmentation[row_index], row[row_index])
            change = change.per(row[row_index])
        })

        while ( column_index -- > 0 ) {
            row_index = column_index
            while ( row_index -- > 0 ) {
                target = echelon[row_index][column_index]
                echelon[row_index] = m.sub(echelon[row_index], m.scale(echelon[column_index], target))
                augmentation[row_index] = m.sub(augmentation[row_index], m.scale(augmentation[column_index], target))
            }
        }

        return [echelon, augmentation]

    }

    function spanning(matrix){
        var size = Math.max(matrix.length, matrix[0].length)
          , target = fully_reduce(matrix.filter(function(row, i){ return i < size })
                            .map(function(row){
                                return row.filter(function(col, i){
                                    return i < size
                                })
                            }))
        return is_identity(target[0])
    }

    function linear_dependence(matrix){
        var t = m.disperse(m(m.zero_vector(matrix[0].length)), zero)
        return fully_reduce(matrix)[0].every(function(row){
            return ! equal(t, row)
        })
    }

    function vatrix(arr){ return arr.map(m) }

    vatrix.m = m

    vatrix.add = addition
    vatrix.ma = addition

    vatrix.subtract = subtraction
    vatrix.ms = subtraction

    vatrix.scalarMultiplication = scalar_multiplication
    vatrix.msm = scalar_multiplication

    vatrix.scalarDivision = scalar_division
    vatrix.msd = scalar_division

    vatrix.transpose = transpose
    vatrix.mt = transpose

    vatrix.determinant = determinant
    vatrix.md = determinant

    vatrix.multiplication = multiplication
    vatrix.mm = multiplication

    vatrix.rowEchelon = row_echelon
    vatrix.me = row_echelon

    vatrix.rowReduce = fully_reduce
    vatrix.mrr = fully_reduce

    vatrix.isSpanning = spanning
    vatrix.linearlyDependent = linear_dependence
    vatrix.drawMatrix = draw_matrix
    vatrix.isLowerTriangular = is_lower_triangular
    vatrix.isUpperTriangular = is_upper_triangular
    vatrix.isDiagonal = is_diagonal
    vatrix.isIdentity = is_identity

    if ( module !== undefined && module.exports ) {
        module.exports = vatrix
    } else {
        root.vatrix = vatrix
    }

}(this)
