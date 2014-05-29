/*
* weibo timeline handling module
* Author: Tsuhui.Li, Ver 1.0
* Created At May 30th,2014  
*/

(function (XPlusZ, $, undefined) {
} (window.XPlusZ = window.XPlusZ || {}, jQuery));


XPlusZ.Configs = {};


XPlusZ.Configs.Weibo = {
    Count: 200,
    PageSize: 10,
    SerectKey: '###,
    TimeLineAPI: 'https://api.weibo.com/2/statuses/public_timeline.json'
};


XPlusZ.WeiboHanlder = {

    contentContainer: null,
    pageContainer: null,
    tmplContent: null,
    tmplPagination: null,
    isInit: false,
    currentPage: 0,
    dataSource: null,

    init: function (_contentContainer, _pageContainer, _tmplContent, _tmplPagination) {
        this.contentContainer = _contentContainer;
        this.pageContainer = _pageContainer;
        this.tmplContent = _tmplContent;
        this.tmplPagination = _tmplPagination;
        this.isInit = true;
    },

    getTimeLine: function () {
        var $this = this;
        if ($this.isInit) {
            $this.showProgress(true);
            $.ajax({
                type: 'GET',
                dataType: "jsonp",
                url: XPlusZ.Configs.Weibo.TimeLineAPI,
                data: {
                    'access_token': XPlusZ.Configs.Weibo.SerectKey,
                    'count': XPlusZ.Configs.Weibo.Count
                },
                success: function (data, textStatus, xhr) {
                    //console.log(data);
                    $this.showProgress(false);
                    if (data && data.data && data.data.statuses) {
                        $this.dataSource = data.data.statuses;
                        $this.render();
                    }
                }
            });
        } else {
            alert('Please set container and template');
        }
    },

    render: function () {
        var data = this.dataSource, $this = this;
        if (data && data !== null) {
            var $this = this, sub = [], pages = [], pageCount = 0,
            count = data.length / XPlusZ.Configs.Weibo.PageSize;
            if (data.length % XPlusZ.Configs.Weibo.PageSize === 0) {
                pageCount = Math.floor(count);
            } else {
                pageCount = Math.floor(count) + 1;
            }
            for (var i = 1; i <= pageCount; i++) {
                pages.push(i);
            }
            this.tmplPagination.tmpl(pages).each(function (index) {
                if (index === 0) {
                    $(this).closest('li').addClass('active');
                }

                $(this).find('a').on('click', function () {
                    var sub = [];
                    $this.showProgress(true);
                    var index = $(this).data('index');
                    if (!$this.currentPage != index) {
                        $this.currentPage = index;
                        $(this).closest('.pagination').find('li').removeClass('active');
                        $(this).closest('li').addClass('active');
                        var start = (index - 1) * XPlusZ.Configs.Weibo.PageSize,
                            end = index * XPlusZ.Configs.Weibo.PageSize;
                        for (var i = start; i < end; i++) {
                            sub.push($this.dataSource[i]);
                        };
                        //console.log(sub);
                        $($this.contentContainer).empty();
                        $this.tmplContent.tmpl(sub).appendTo($this.contentContainer);
                        $this.showProgress(false);
                    }
                });
            }).appendTo(this.pageContainer);

            for (var i = 0; i < 10; i++) {
                sub.push(data[i]);
            };
            this.tmplContent.tmpl(sub).appendTo(this.contentContainer);
        }
    },

    showProgress: function (isDisplay) {
        if (isDisplay) {
            $('#progress').modal({
                show: true,
                keyboard: false,
                backdrop: 'static'
            });
        } else {
            // to make the loading effect not flash out. timer can be removed
            setTimeout(function () {
                $('#progress').modal('hide');
            }, 1000);
        }
    }
};


$(document).ready(function () {
    var contentContainer = '#weibo-container';
    var pageContainer = '.pagination';
    var tmplContent = $('#tmplTimeLine');
    var tmplPagination = $('#tmplPagination');
    XPlusZ.WeiboHanlder.init(contentContainer, pageContainer, tmplContent, tmplPagination);
    XPlusZ.WeiboHanlder.getTimeLine();
});
