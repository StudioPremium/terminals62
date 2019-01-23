function togglerMoveXs() {
    $('#nav-toggler-container-xs').prepend($('#nav-toggler-move'));
};

function togglerMoveSm() {
    $('#nav-toggler-container-sm').prepend($('#nav-toggler-move'));
};
if (document.documentElement.clientWidth < 576) {
    togglerMoveXs();
};
$(document).ready(function() {
    $(window).resize(function() {
        if (document.documentElement.clientWidth < 576) {
            togglerMoveXs();
        } else {
            togglerMoveSm();
        };
    });
});