(function () {
    document.addEventListener("DOMContentLoaded", function () {
        const back = document.querySelector(".back-button");

        const load = document.querySelector(".load-button");
        const play = document.querySelector(".play-button");

        const loadSaveButtons = document.querySelectorAll(".load-save-button");

        // Make it keyboard accessible
        back.setAttribute("role", "button");
        back.setAttribute("tabindex", "0");

        function goBack() {
            if (window.history.length > 1) window.history.back();
            else window.location.href = "/";
        }

        back.addEventListener("click", function (e) {
            goBack();
        });

        if (play && load) {
            play.addEventListener("click", function (e) {
                window.location.href = "/new_save/";
            });

            load.addEventListener("click", function (e) {
                window.location.href = "/saves/";
            });
        }

        function loadSave(saveId) {
            window.location.href = `/saves/${saveId}/`;
        }

        loadSaveButtons.forEach(function (button) {
            button.addEventListener("click", function (e) {
                const saveId = button.getAttribute("data-save-id");
                loadSave(saveId);
            });
        });
    });
})();
