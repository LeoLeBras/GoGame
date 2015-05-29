(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

(function () {

    /* **
        loadCSS
         (FilamentGroup.com - v0.1.0 - 2014-07-24
        http://filamentgroup.com/
        Copyright (c) 2014 Filament Group Copyright 2014 @scottjehl, Filament Group, Inc. Licensed MIT)
        
    ** */

    var doc = window.document;

    function loadCSS(href, before, media) {

        var ss = window.document.createElement("link");
        var ref = before || window.document.getElementsByTagName("script")[0];
        var sheets = window.document.styleSheets;
        ss.rel = "stylesheet";
        ss.href = href;
        ss.media = "all";
        ref.parentNode.insertBefore(ss, ref);

        function toggleMedia() {
            var defined;
            for (var i = 0; i < sheets.length; i++) {
                if (sheets[i].href && sheets[i].href.indexOf(href) > -1) {
                    defined = true;
                }
            }

            if (defined) {
                ss.media = media || "all";
            } else {
                setTimeout(toggleMedia);
            }
        }
        toggleMedia();
        return ss;
    }

    if (!("querySelector" in doc)) {
        return;
    }

    var supportsWoff2 = (function (win) {
        if (!("FontFace" in win)) {
            return false;
        }
        var f = new win.FontFace("t", "url( \"data:application/font-woff2,\" ) format( \"woff2\" )", {});
        f.load()["catch"](function () {});
        return f.status == "loading";
    })(window);

    var ua = navigator.userAgent,
        fontDirUrl = "./css/",
        fontFileUrl = fontDirUrl + "woff.css";

    /*if( supportsWoff2 ) {
        fontFileUrl = fontDirUrl + '--woff2.css';
    }*/

    if (ua.indexOf("Android") > -1 && ua.indexOf("like Gecko") > -1 && ua.indexOf("Chrome") === -1) {
        fontFileUrl = fontDirUrl + "ttf.css";
    }

    loadCSS(fontFileUrl);
})(undefined);

},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkQ6XFxEcm9wYm94XFxTaXRlc1xcd3d3XFxHb0dhbWVcXG5vZGVfbW9kdWxlc1xcZ3VscC1icm93c2VyaWZ5XFxub2RlX21vZHVsZXNcXGJyb3dzZXJpZnlcXG5vZGVfbW9kdWxlc1xcYnJvd3Nlci1wYWNrXFxfcHJlbHVkZS5qcyIsIkQ6L0Ryb3Bib3gvU2l0ZXMvd3d3L0dvR2FtZS9zcmMvanMvZmFrZV80M2I4MjI1OC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUEsQUFBQyxDQUFBLFlBQVU7Ozs7Ozs7Ozs7QUFXUCxRQUFJLEdBQUcsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDOztBQUUxQixhQUFTLE9BQU8sQ0FBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRTs7QUFFbkMsWUFBSSxFQUFFLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUUsTUFBTSxDQUFFLENBQUM7QUFDakQsWUFBSSxHQUFHLEdBQUcsTUFBTSxJQUFJLE1BQU0sQ0FBQyxRQUFRLENBQUMsb0JBQW9CLENBQUUsUUFBUSxDQUFFLENBQUUsQ0FBQyxDQUFFLENBQUM7QUFDMUUsWUFBSSxNQUFNLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUM7QUFDekMsVUFBRSxDQUFDLEdBQUcsR0FBRyxZQUFZLENBQUM7QUFDdEIsVUFBRSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7QUFDZixVQUFFLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztBQUNqQixXQUFHLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBRSxFQUFFLEVBQUUsR0FBRyxDQUFFLENBQUM7O0FBRXZDLGlCQUFTLFdBQVcsR0FBRTtBQUNsQixnQkFBSSxPQUFPLENBQUM7QUFDWixpQkFBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDcEMsb0JBQUksTUFBTSxDQUFFLENBQUMsQ0FBRSxDQUFDLElBQUksSUFBSSxNQUFNLENBQUUsQ0FBQyxDQUFFLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBRSxJQUFJLENBQUUsR0FBRyxDQUFDLENBQUMsRUFBRTtBQUMzRCwyQkFBTyxHQUFHLElBQUksQ0FBQztpQkFDbEI7YUFDSjs7QUFFRCxnQkFBSSxPQUFPLEVBQUU7QUFDVCxrQkFBRSxDQUFDLEtBQUssR0FBRyxLQUFLLElBQUksS0FBSyxDQUFDO2FBQzdCLE1BQ0k7QUFDRCwwQkFBVSxDQUFFLFdBQVcsQ0FBRSxDQUFDO2FBQzdCO1NBQ0o7QUFDRCxtQkFBVyxFQUFFLENBQUM7QUFDZCxlQUFPLEVBQUUsQ0FBQztLQUNiOztBQUVELFFBQUksRUFBRyxlQUFlLElBQUksR0FBRyxDQUFBLEFBQUUsRUFBRTtBQUM3QixlQUFPO0tBQ1Y7O0FBRUQsUUFBSSxhQUFhLEdBQUcsQ0FBQyxVQUFVLEdBQUcsRUFBRTtBQUNoQyxZQUFJLEVBQUcsVUFBVSxJQUFJLEdBQUcsQ0FBQSxBQUFFLEVBQUc7QUFDekIsbUJBQU8sS0FBSyxDQUFDO1NBQ2hCO0FBQ0QsWUFBSSxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsUUFBUSxDQUFFLEdBQUcsRUFBRSw2REFBeUQsRUFBRSxFQUFFLENBQUUsQ0FBQztBQUMvRixTQUFDLENBQUMsSUFBSSxFQUFFLFNBQU0sQ0FBQyxZQUFXLEVBQUUsQ0FBQyxDQUFDO0FBQzlCLGVBQU8sQ0FBQyxDQUFDLE1BQU0sSUFBSSxTQUFTLENBQUM7S0FDaEMsQ0FBQSxDQUFHLE1BQU0sQ0FBRSxDQUFDOztBQUdiLFFBQUksRUFBRSxHQUFHLFNBQVMsQ0FBQyxTQUFTO1FBQ3hCLFVBQVUsR0FBRyxRQUFRO1FBQ3JCLFdBQVcsR0FBRyxVQUFVLEdBQUcsVUFBVSxDQUFDOzs7Ozs7QUFNMUMsUUFBRyxFQUFFLENBQUMsT0FBTyxDQUFFLFNBQVMsQ0FBRSxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxPQUFPLENBQUUsWUFBWSxDQUFFLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLE9BQU8sQ0FBRSxRQUFRLENBQUUsS0FBSyxDQUFDLENBQUMsRUFBRTtBQUNqRyxtQkFBVyxHQUFHLFVBQVUsR0FBRyxTQUFTLENBQUM7S0FDeEM7O0FBRUQsV0FBTyxDQUFFLFdBQVcsQ0FBRSxDQUFDO0NBRTFCLENBQUEsV0FBUSxDQUFFIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIihmdW5jdGlvbigpe1xuXG4gICAgLyogKipcbiAgICAgICAgbG9hZENTU1xuXG4gICAgICAgIChGaWxhbWVudEdyb3VwLmNvbSAtIHYwLjEuMCAtIDIwMTQtMDctMjRcbiAgICAgICAgaHR0cDovL2ZpbGFtZW50Z3JvdXAuY29tL1xuICAgICAgICBDb3B5cmlnaHQgKGMpIDIwMTQgRmlsYW1lbnQgR3JvdXAgQ29weXJpZ2h0IDIwMTQgQHNjb3R0amVobCwgRmlsYW1lbnQgR3JvdXAsIEluYy4gTGljZW5zZWQgTUlUKVxuICAgICAgICBcbiAgICAqKiAqL1xuICAgIFxuICAgIHZhciBkb2MgPSB3aW5kb3cuZG9jdW1lbnQ7XG4gICAgXG4gICAgZnVuY3Rpb24gbG9hZENTUyggaHJlZiwgYmVmb3JlLCBtZWRpYSApe1xuICAgICAgICBcbiAgICAgICAgdmFyIHNzID0gd2luZG93LmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoIFwibGlua1wiICk7XG4gICAgICAgIHZhciByZWYgPSBiZWZvcmUgfHwgd2luZG93LmRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCBcInNjcmlwdFwiIClbIDAgXTtcbiAgICAgICAgdmFyIHNoZWV0cyA9IHdpbmRvdy5kb2N1bWVudC5zdHlsZVNoZWV0cztcbiAgICAgICAgc3MucmVsID0gXCJzdHlsZXNoZWV0XCI7XG4gICAgICAgIHNzLmhyZWYgPSBocmVmO1xuICAgICAgICBzcy5tZWRpYSA9IFwiYWxsXCI7XG4gICAgICAgIHJlZi5wYXJlbnROb2RlLmluc2VydEJlZm9yZSggc3MsIHJlZiApO1xuICAgICAgICBcbiAgICAgICAgZnVuY3Rpb24gdG9nZ2xlTWVkaWEoKXtcbiAgICAgICAgICAgIHZhciBkZWZpbmVkO1xuICAgICAgICAgICAgZm9yKCB2YXIgaSA9IDA7IGkgPCBzaGVldHMubGVuZ3RoOyBpKysgKXtcbiAgICAgICAgICAgICAgICBpZiggc2hlZXRzWyBpIF0uaHJlZiAmJiBzaGVldHNbIGkgXS5ocmVmLmluZGV4T2YoIGhyZWYgKSA+IC0xICl7XG4gICAgICAgICAgICAgICAgICAgIGRlZmluZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYoIGRlZmluZWQgKXtcbiAgICAgICAgICAgICAgICBzcy5tZWRpYSA9IG1lZGlhIHx8IFwiYWxsXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCB0b2dnbGVNZWRpYSApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRvZ2dsZU1lZGlhKCk7XG4gICAgICAgIHJldHVybiBzcztcbiAgICB9XG4gICAgXG4gICAgaWYoICEoIFwicXVlcnlTZWxlY3RvclwiIGluIGRvYyApICl7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgXG4gICAgdmFyIHN1cHBvcnRzV29mZjIgPSAoZnVuY3Rpb24oIHdpbiApe1xuICAgICAgICBpZiggISggXCJGb250RmFjZVwiIGluIHdpbiApICkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHZhciBmID0gbmV3IHdpbi5Gb250RmFjZSggXCJ0XCIsICd1cmwoIFwiZGF0YTphcHBsaWNhdGlvbi9mb250LXdvZmYyLFwiICkgZm9ybWF0KCBcIndvZmYyXCIgKScsIHt9ICk7XG4gICAgICAgIGYubG9hZCgpLmNhdGNoKGZ1bmN0aW9uKCkge30pO1xuICAgICAgICByZXR1cm4gZi5zdGF0dXMgPT0gJ2xvYWRpbmcnO1xuICAgIH0pKCB3aW5kb3cgKTtcblxuICAgIFxuICAgIHZhciB1YSA9IG5hdmlnYXRvci51c2VyQWdlbnQsXG4gICAgICAgIGZvbnREaXJVcmwgPSAnLi9jc3MvJyxcbiAgICAgICAgZm9udEZpbGVVcmwgPSBmb250RGlyVXJsICsgJ3dvZmYuY3NzJztcblxuICAgIC8qaWYoIHN1cHBvcnRzV29mZjIgKSB7XG4gICAgICAgIGZvbnRGaWxlVXJsID0gZm9udERpclVybCArICctLXdvZmYyLmNzcyc7XG4gICAgfSovXG4gICAgXG4gICAgaWYodWEuaW5kZXhPZiggXCJBbmRyb2lkXCIgKSA+IC0xICYmIHVhLmluZGV4T2YoIFwibGlrZSBHZWNrb1wiICkgPiAtMSAmJiB1YS5pbmRleE9mKCBcIkNocm9tZVwiICkgPT09IC0xICl7XG4gICAgICAgIGZvbnRGaWxlVXJsID0gZm9udERpclVybCArICd0dGYuY3NzJztcbiAgICB9XG5cbiAgICBsb2FkQ1NTKCBmb250RmlsZVVybCApO1xuXG59KCB0aGlzICkpOyJdfQ==
