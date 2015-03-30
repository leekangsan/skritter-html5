app.addFonts({
    custom: {
        families: ['Arial Unicode MS', 'Muli', 'Roboto Slab'],
        urls: ['styles/fonts.css']
    }
});

app.addPaths({
    'createjs.easel': 'libraries/createjs.easel-NEXT.min',
    'createjs.tween': 'libraries/createjs.tween-NEXT.min'
});

app.addShim({});