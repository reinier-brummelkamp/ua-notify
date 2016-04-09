//https://addyosmani.com/resources/essentialjsdesignpatterns/book/#singletonpatternjavascript
//http://codeseven.github.io/toastr/

var Notify = (function () {
    "use strict";

    // Instance stores a reference to the Singleton
    var notify_instance;

    function notify_init(app) {
        // Private variables
        var _appContainer = app.AppContainer();
        var _elementFactory = app.ElementFactory();

        var _defaultShowToasterOptions = {
            "closeButton": false,
            "debug": false,
            "newestOnTop": false,
            "progressBar": false,
            "positionClass": "toast-top-right",
            "preventDuplicates": false,
            "onclick": null,
            "showDuration": "300",
            "hideDuration": "1000",
            "timeOut": "5000",
            "extendedTimeOut": "1000",
            "showEasing": "swing",
            "hideEasing": "swing",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        }

        var _defaultConfirmToasterOptions = {
            "closeButton": false,
            "debug": false,
            "newestOnTop": false,
            "progressBar": false,
            "positionClass": "toast-top-right",
            "preventDuplicates": false,
            "showDuration": "300",
            "hideDuration": "1000",
            "timeOut": 0,
            "extendedTimeOut": 0,
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut",
            "tapToDismiss": false
        }

        var confirmMarkup = '<br /><br /><button type="button" class="btn confirm-yes">Yes</button> <button type="button" class="btn confirm-no">No</button>';

        // Initialize default toastr options        
        toastr.options = _defaultShowToasterOptions;

        // Private methods
        function generateConfirmPromise(toasterInstance) {
            return new Promise(function (resolve, reject) {
                if (toasterInstance.find('.btn.confirm-yes').length) {
                    toasterInstance.find('.btn.confirm-yes').on('click', function () {
                        toastr.clear(toasterInstance, { force: true });
                        resolve();
                    });
                }

                if (toasterInstance.find('.btn.confirm-no').length) {
                    toasterInstance.find('.btn.confirm-no').on('click', function () {
                        toastr.clear(toasterInstance, { force: true });
                        reject();
                    });
                }
            });
        }

        return {
            // Public methods and variables

            // Public methods and variables
            showInfo: function (message, title, overrideOptions) {
                toastr.options = _defaultShowToasterOptions;
                toastr.info(message, title, overrideOptions);
            },

            showWarning: function (message, title, overrideOptions) {
                toastr.options = _defaultShowToasterOptions;
                toastr.warning(message, title, overrideOptions);
            },

            showSuccess: function (message, title, overrideOptions) {
                toastr.options = _defaultShowToasterOptions;
                toastr.success(message, title, overrideOptions);
            },

            showError: function (message, title, overrideOptions) {
                toastr.options = _defaultShowToasterOptions;
                toastr.error(message, title, overrideOptions);
            },


            confirmInfo: function (message, title, overrideOptions) {
                var messageBody = message + confirmMarkup;

                toastr.options = _defaultConfirmToasterOptions;

                return generateConfirmPromise(toastr.info(messageBody, title, overrideOptions));
            },

            confirmWarning: function (message, title, overrideOptions) {
                var messageBody = message + confirmMarkup;

                toastr.options = _defaultConfirmToasterOptions;

                return generateConfirmPromise(toastr.warning(messageBody, title, overrideOptions));
            },

            confirmSuccess: function (message, title, overrideOptions) {
                var messageBody = message + confirmMarkup;

                toastr.options = _defaultConfirmToasterOptions;

                return generateConfirmPromise(toastr.success(messageBody, title, overrideOptions));
            },

            confirmError: function (message, title, overrideOptions) {
                var messageBody = message + confirmMarkup;

                toastr.options = _defaultConfirmToasterOptions;

                return generateConfirmPromise(toastr.error(messageBody, title, overrideOptions));
            },

            showModalDialog: function (options) {
                var _th = this;

                _elementFactory.createElement(options.elementName).then(function (element) {

                    if (options.initFunc)
                        options.initFunc(element);

                    _appContainer.setModalBackdropContents(element);
                    _appContainer.showModalBackdrop();

                    element.addEventListener('dialog-accept', function (e) {
                        if (!options.preventCloseOnAccept)
                            _th.hideModalDialog();

                        if (options.acceptFunc)
                            options.acceptFunc(element, e.detail);
                    })
                    element.addEventListener('dialog-reject', function (e) {
                        if (!options.preventCloseOnReject)
                            _th.hideModalDialog();

                        if (options.rejectFunc)
                            options.rejectFunc(element, e.detail);
                    })
                }, function (error) {
                    console.error(error);
                });
            },

            hideModalDialog: function () {
                _appContainer.hideModalBackdrop();
                _appContainer.setModalBackdropContents(null);
            }
        };
    };

    return {

        // Get the Singleton instance if one exists
        // or create one if it doesn't  
        getInstance: function (app) {
            if (!notify_instance)
                notify_instance = notify_init(app);

            return notify_instance;
        }

    }
}());