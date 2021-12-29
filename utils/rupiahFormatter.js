module.exports = (number) => {
    let numberString = number.toString();
    let result = []
    
    for (let i = 0; i < numberString.length; i++) {
        if (i > 0 && i % 3 == 0) {
            result.unshift(".")
        }
        result.unshift(numberString.charAt(numberString.length-1-i))
    }

    return `Rp ${result.join('')}`
}