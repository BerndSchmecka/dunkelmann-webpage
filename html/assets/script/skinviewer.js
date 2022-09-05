/*! *****************************************************************************
Copyright (c) Dunkelmann 2022. All rights reserved.

This code is licensed under the BSD License
You should have received a copy of the BSD License
with this code and it is also available through
the world-wide-web at <https://files.dunkelmann.eu/license.txt>.
If you did not receive a copy of the BSD License
and are unable to obtain it through the world-wide-web,
please send a note to <business@dunkelmann.eu> so we can mail you a copy
immediately.
***************************************************************************** */

let API = "https://api.ashcon.app/mojang/v2/user/";

var app = new Vue({
    el: '#skinViewerApp',
    data: {
        skinViewer: null
    },
    created: function() {
        window.onload = function() {
            this.initViewer();
        }.bind(this);
    },
    methods: {
        initViewer: function() {
            this.skinViewer = new skinview3d.SkinViewer({
                canvas: document.getElementById('skin_container'),
                width: 400,
                height: 400,
                skin: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAABJlBMVEUAAAD////GloC9jnS9jnK9i3K7iXK+iGy2iWy3gnK0hG0AzMytgG21e2eze2KqfWasdlqcclwAr6+Wb1uiakedak8AqKicaUyfaEmcZ0iaZEqcY0acY0WaY0QAnp6WX0GWX0AAmZlra2uQXkOPXj6KWTuIWjmHWDqHVTuDVTuGUzSBUzmEUjGAUzRWScwAf396TjN0SC91Ry93QjVvRSxtQypSPYlqQDBiQy9GOqUAaGgAYGAAW1s/Pz86MYlRMSVSKCYwKHJCKhI/KhU6KBQmIVsoKCg0JRIzJBEyIxAvIhEjIyMvIA0tIBAvHw8sHhEsHg4tHQ4rHg4rHg0qHQ0pHAwoHAsoGwsoGwonGwsoGg0mGgwmGgomGAskGAokGAgjFwkfEAs7wqHyAAAAAXRSTlMAQObYZgAAAyZJREFUeNrt1ltXm0AQAGDtxbbSlnbQtbbKdm1VJDarsRXZIimtWC8V0YBiJKL//0/07G7QXIwhyavzQi7sx+wy58yMjTUjirIoyrKbSjPGBo0oC4Ioy7KKZVqmOQwQBKkEDg8PD63BgSzgewiioYEoiNI0GAUQ63Pg1xBAGsTpDQdEDAHEaZqmUTTwa0yS9CLePzr6VwvOsrQWHR3txxdpkuR1UQRIw7i2V6vV9n7/Cc/2anGYcqBZF32BsJHGp+dXce3lsyfPn777G1+dn8ZpI8zron8G9ZMwuQgP1En19fuJmZmD8CIJT+pJXhcFtpBcXi/P7UyOb76Z2BxXd+aWry+TJMnrogBQbxyv4qVPb19Z1oupb0t49bhR54co66L/GSQnW9PzZuXL542NjY2vpYo5P711koR5XfQFTHPenMWL699/lEprKytr64sfZj/OzptmhddFxSxUC+Vyuby7u7ubf1dkLSk/m5H/jhQFWVWr2h+Q5dwFKIqijAqgqlW1RtpCF+B5vmfbtu35Hr+6lFKH6KWpUknXKaVURwgBICQ/g7gCANwBfhtgU8YoQnqppANQxhjidwNCjDEKCHT+fwfgtQHiRkA6QQCMMQYykIBBoA8DDmMOAOgEAORnAohIQIeHMvB8z3VdlzmOQwhfRojjOI5YTQAwxoaqqqqBMebXdsB1bX4WHHAchxH5UMIch4H4giSgqSo27gNaz4ADAAQJgDGxmhAwJKAJQNNaAM/regs5QMUh3gL8yRww2jPIAe8OALEKSH5gPAxsSAB3ANvbObC9vbCwsEAZpYTwBCRACBHHgCWgYp6JpmotgFyYXz3f8zlou0AoLzLXRYS4tgQ0VWTSBxAZ2bZL8vImtm3zJ2uqphmdGTzGYzzGYwwyL6BeXbnwwKEoykgA6jVYDLKFwkDrvODyPkEpRYD0rrmgP+DfNhodENBmqy8OeH5rp0JdbX0Q4N65oCfQMS/0nAt6A76cF26BvKUVBTq2wAFNAkbbXNAfkFsxBCC6slEwA68DwBIwCgKd8wJu7p2PNnwrBYD2di+erI0CYGxomhht7gX+AwpAOZvrRgeGAAAAAElFTkSuQmCC',
            });
        },
        updateSkin: function(uuid) {
            var req = new XMLHttpRequest();
            req.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    var data = JSON.parse(this.responseText);
                    if(data.textures.skin){
                        app.skinViewer.loadSkin(`data:image/png;base64,${data.textures.skin.data}`);
                    } else {
                        app.skinViewer.loadSkin('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAABJlBMVEUAAAD////GloC9jnS9jnK9i3K7iXK+iGy2iWy3gnK0hG0AzMytgG21e2eze2KqfWasdlqcclwAr6+Wb1uiakedak8AqKicaUyfaEmcZ0iaZEqcY0acY0WaY0QAnp6WX0GWX0AAmZlra2uQXkOPXj6KWTuIWjmHWDqHVTuDVTuGUzSBUzmEUjGAUzRWScwAf396TjN0SC91Ry93QjVvRSxtQypSPYlqQDBiQy9GOqUAaGgAYGAAW1s/Pz86MYlRMSVSKCYwKHJCKhI/KhU6KBQmIVsoKCg0JRIzJBEyIxAvIhEjIyMvIA0tIBAvHw8sHhEsHg4tHQ4rHg4rHg0qHQ0pHAwoHAsoGwsoGwonGwsoGg0mGgwmGgomGAskGAokGAgjFwkfEAs7wqHyAAAAAXRSTlMAQObYZgAAAyZJREFUeNrt1ltXm0AQAGDtxbbSlnbQtbbKdm1VJDarsRXZIimtWC8V0YBiJKL//0/07G7QXIwhyavzQi7sx+wy58yMjTUjirIoyrKbSjPGBo0oC4Ioy7KKZVqmOQwQBKkEDg8PD63BgSzgewiioYEoiNI0GAUQ63Pg1xBAGsTpDQdEDAHEaZqmUTTwa0yS9CLePzr6VwvOsrQWHR3txxdpkuR1UQRIw7i2V6vV9n7/Cc/2anGYcqBZF32BsJHGp+dXce3lsyfPn777G1+dn8ZpI8zron8G9ZMwuQgP1En19fuJmZmD8CIJT+pJXhcFtpBcXi/P7UyOb76Z2BxXd+aWry+TJMnrogBQbxyv4qVPb19Z1oupb0t49bhR54co66L/GSQnW9PzZuXL542NjY2vpYo5P711koR5XfQFTHPenMWL699/lEprKytr64sfZj/OzptmhddFxSxUC+Vyuby7u7ubf1dkLSk/m5H/jhQFWVWr2h+Q5dwFKIqijAqgqlW1RtpCF+B5vmfbtu35Hr+6lFKH6KWpUknXKaVURwgBICQ/g7gCANwBfhtgU8YoQnqppANQxhjidwNCjDEKCHT+fwfgtQHiRkA6QQCMMQYykIBBoA8DDmMOAOgEAORnAohIQIeHMvB8z3VdlzmOQwhfRojjOI5YTQAwxoaqqqqBMebXdsB1bX4WHHAchxH5UMIch4H4giSgqSo27gNaz4ADAAQJgDGxmhAwJKAJQNNaAM/regs5QMUh3gL8yRww2jPIAe8OALEKSH5gPAxsSAB3ANvbObC9vbCwsEAZpYTwBCRACBHHgCWgYp6JpmotgFyYXz3f8zlou0AoLzLXRYS4tgQ0VWTSBxAZ2bZL8vImtm3zJ2uqphmdGTzGYzzGYwwyL6BeXbnwwKEoykgA6jVYDLKFwkDrvODyPkEpRYD0rrmgP+DfNhodENBmqy8OeH5rp0JdbX0Q4N65oCfQMS/0nAt6A76cF26BvKUVBTq2wAFNAkbbXNAfkFsxBCC6slEwA68DwBIwCgKd8wJu7p2PNnwrBYD2di+erI0CYGxomhht7gX+AwpAOZvrRgeGAAAAAElFTkSuQmCC');
                    }

                    if(data.textures.cape){
                        app.skinViewer.loadCape(`data:image/png;base64,${data.textures.cape.data}`);
                    } else {
                        app.skinViewer.loadCape(null);
                    }

                }
            }
            req.open("GET", API + uuid, true);
            req.send();
        }
    }
});
