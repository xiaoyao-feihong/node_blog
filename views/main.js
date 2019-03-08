$(function(){
    $('.btnWithdraw').on('click',function (e) {
        $.ajax({
            url: 'http://127.0.0.1:3000/withdraw',
            type: 'get',
            success: function(result){
                location.href = '/'
            }
        })
    })
})