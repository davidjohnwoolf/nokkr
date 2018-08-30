module.exports = {
    capitalize: (s) => s.charAt(0).toUpperCase() + s.slice(1),
    formatLabel: name => name.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())
}