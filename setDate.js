(function(){
    $.fn.extend({
        timeModule: function(options){
            options = $.extend({}, $.fn.defaults, options || {})
            var startY,     // 点击坐标
                moveY,      // 移动坐标
                liH,        // li高度
                tYear,      // 年
                tMonth,     // 月
                tDay,       // 日
                selfTime,       // 当前日期
                start = options.yearObj.start,      // 输出开始年份
                end = options.yearObj.end,          // 输出结束年份
                _this = this,       // 当前demo
                method = {},        // 方法
                body = $('body'),   // body
                timeDemo = $('<div class="timeModule"></div>')  // 弹窗demo
            // 获取当前时间
            if(_this.val() == ''){
                var myDate = new Date(),
                    year=myDate.getFullYear(),
                    month=myDate.getMonth()+1,
                    date=myDate.getDate()
                selfTime = [year,month,date]
            }else{
                selfTime = _this.val().split('-')
            }
            // 组装弹窗demo
            timeDemo.append(
                '<div class="timeMain">\n'+
                    '<div class="timeBtn">\n'+
                        '<a href="javascript:;" class="timeNo">取消</a>\n'+
                        '<a href="javascript:;" class="timeYes">确定</a>\n'+
                    '</div>\n'+
                    '<div class="timeList">\n'+
                        '<div class="box tYear"><ul></ul></div>\n'+
                        '<div class="box tMonth"><ul></ul></div>\n'+
                        '<div class="box tDay"><ul></ul></div>\n'+
                    '</div>\n'+
                '</div>'
            )
            tYear = timeDemo.find('.tYear ul')
            tMonth = timeDemo.find('.tMonth ul')
            tDay = timeDemo.find('.tDay ul')
            for(var i = start; i <= end; i++){
                tYear.append('<li>'+ i +'</li>')
            }
            for(var i = 1; i <= 12; i++){
                tMonth.append('<li>'+ i +'</li>')
            }
            for(var i = 1; i <= 31; i++){
                tDay.append('<li>'+ i +'</li>')
            }
            body.append(timeDemo)
            // 显示弹窗
            setTimeout(function(){
                timeDemo.css({'opacity':'1'})
                timeDemo.find('.timeMain').css({'transform':'translateY(0)'})
            }, 200)
            _this.blur()
            // 获取li高度
            liH = parseInt(timeDemo.find('li').height())
            // 选择当前时间位置
            $.each(selfTime, function(index, item){
                var box = timeDemo.find('.box:eq('+ index +')'), tX
                box.find('li').each(function(){
                    if($(this).text() == selfTime[index]){
                        var i = parseInt($(this).index())
                        if(i == 0){
                            tX = liH
                        }else if(i > 0){
                            tX = -(liH * (i - 1))
                        }
                    }
                })
                box.find('ul').css('transform','translateY('+ tX +'px)')
            })
            // 点击确定
            timeDemo.find('.timeYes').click(function(){
                var tYearY = parseInt(tYear.css('transform').match().input.split('(')[1].split(')')[0].split(',')[5]),
                    tMonthY = parseInt(tMonth.css('transform').match().input.split('(')[1].split(')')[0].split(',')[5]),
                    tDayY = parseInt(tDay.css('transform').match().input.split('(')[1].split(')')[0].split(',')[5]),
                    timeArr = [tYearY,tMonthY,tDayY]
                $.each(timeArr, function(index, item){
                    var i
                    if(item > 0){
                        i = 0
                    }else if(item <= 0){
                        i = Math.abs(item / liH) + 1
                    }
                    timeArr[index] = timeDemo.find('.box:eq('+ index +') li').eq(i).text()
                })
                _this.val(timeArr[0]+'-'+timeArr[1]+'-'+timeArr[2])
                method.closeTime()
            })
            // 点击取消
            timeDemo.find('.timeNo').click(function(){
                method.closeTime()
            })
            // 拖动事件
            timeDemo.find('.tYear ul,.tMonth ul,.tDay ul').on('touchstart', function(e){
                var self = $(this)
                startY = e.originalEvent.targetTouches[0].pageY
                $(document).on('touchmove', function(e){
                    method.touchMove(self, e)
                })
                $(document).on('touchend', function(){
                    method.touchEnd(self)
                    $(document).unbind('touchmove')
                    $(document).unbind('touchend')
                })
            })
            // 关闭弹窗
            method.closeTime = function(){
                timeDemo.css({'opacity':'0'})
                timeDemo.find('.timeMain').css({'transform':'translateY(100%)'})
                setTimeout(function(){
                    timeDemo.remove()
                }, 500)
            }
            // 拖动时执行事件
            method.touchMove = function(self, e){
                var offsetY = parseInt(self.css('transform').match().input.split('(')[1].split(')')[0].split(',')[5])
                var maxHeight = parseInt(self.height()) - liH * 2
                moveY = e.originalEvent.targetTouches[0].pageY
                if(moveY < startY){
                    offsetY -= 2
                    if(offsetY <= -maxHeight){
                        offsetY = -maxHeight
                    }
                }else{
                    offsetY += 2
                    if(offsetY >= liH){
                        offsetY = liH
                    }
                }
                self.css('transform','translateY('+ offsetY +'px)')
            }
            // 拖动结束执行事件
            method.touchEnd = function(self){
                var offsetY = parseInt(self.css('transform').match().input.split('(')[1].split(')')[0].split(',')[5])
                integer = Math.abs(offsetY)
                integer = Math.round(integer/liH) * liH
                if(offsetY < 0){
                    integer = integer*-1
                }
                self.css('transform','translateY('+ integer +'px)')
            }
        }
    })
    $.fn.defaults = {
        // 初始化参数
        'yearObj' : {'start': 2010, 'end': 2030}    // start 开始年份， end结束年份
    }
}())