function feedbackFormValidity(modalFeedbackFormID, modalFeedbackFormInputClass) {
    $('' + modalFeedbackFormInputClass + '').change(function() {
        if ($(this).closest('' + modalFeedbackFormID + '')[0].checkValidity()) {
            alert('верно');
        } else {
            alert('неверно');
        };
    });
};