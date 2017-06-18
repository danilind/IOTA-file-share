/**
 * Created by Daniel on 18.06.2017.
 */
function chop(array, size){
    // Copy-paste from https://stackoverflow.com/questions/11318680/split-array-into-chunks-of-n-length
    var arrays = [];

    while (array.length > 0) {
        arrays.push(array.splice(0, size));
    }

    return arrays;
}