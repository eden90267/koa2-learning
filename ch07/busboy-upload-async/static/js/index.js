(function () {

    let btn = document.querySelector('#J_UploadPictureBtn');
    let progressElem = document.querySelector('#J_UploadProgress');
    let previewElem = document.querySelector('#J_PicturePreview');

    btn.addEventListener('click', function () {
        uploadAction({
            success: function (result) {
                console.log(result);
                if (result && result.success && result.data && result.data.pictureUrl) {
                    previewElem.innerHTML = '<img src="' + result.data.pictureUrl + '" style="max-width: 100%">';
                }
            },
            progress: function (data) {
                if (data && data * 1 > 0) {
                    progressElem.innerHTML = data;
                }
            }
        })
    });

    /**
     * 類型判斷
     * @type {{isPrototype: isPrototype, isJSON: isJSON, isFunction: isFunction}}
     */
    let UtilType = {
        isPrototype: function (data) {
            return Object.prototype.toString.call(data).toLowerCase();
        },

        isJSON: function (data) {
            return this.isPrototype(data) === '[object object]';
        },

        isFunction: function (data) {
            return this.isPrototype(data) === '[object function]';
        },
    };


    /**
     * form表單上傳請求事件
     * @param {object} options 請求參數
     */
    function requestEvent(options) {
        try {
            let formData = options.formData;
            let xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    options.success(JSON.parse(xhr.responseText));
                }
            };
            xhr.upload.onprogress = function (evt) {
                let loaded = evt.loaded;
                let tot = evt.total;
                let per = Math.floor(100 * loaded / tot);
                options.progress(per);
            };
            xhr.open('post', '/api/picture/upload.json');
            xhr.send(formData);
        } catch (err) {
            options.fail(err);
        }
    }

    /**
     * 上傳事件
     * @param {object} options 上傳參數
     */
    function uploadEvent(options) {
        let file;
        let formData = new FormData();
        let input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('name', 'files');

        input.click();
        input.onchange = function () {
            file = input.files[0];
            formData.append('files', file);

            requestEvent({
                formData,
                success: options.success,
                fail: options.fail,
                progress: options.progress
            });
        }
    }

    /**
     * 上傳操作
     * @param {object} options 上傳參數
     */
    function uploadAction(options) {
        if (!UtilType.isJSON(options)) {
            return console.log('upload options is null');
        }
        let _options = {};
        _options.success = UtilType.isFunction(options.success) ? options.success : function () {
        };
        _options.fail = UtilType.isFunction(options.fail) ? options.fail : function () {
        };
        _options.progress = UtilType.isFunction(options.progress) ? options.progress : function () {
        };

        uploadEvent(_options);
    }


})();