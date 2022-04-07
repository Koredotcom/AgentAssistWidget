import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { CHAT_HISTORY } from './templates-chat-history.mock';
import * as moment from 'moment-timezone';
import { buttonTemplate, templateAttachment, warningTemplate, quickReplyTemplate, listTemplate, miniTableHorizontalTemplate, carouselTemplate, barchartTemplate, pieChartTemplate, linechartTemplate, tableChartTemplate } from '../../data/templates.model';
import WaveSurfer from 'wavesurfer.js';
import Regions from 'wavesurfer.js/dist/plugin/wavesurfer.regions.min.js';
import Cursor from 'wavesurfer.js/dist/plugin/wavesurfer.cursor.min.js';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { workflowService } from '@kore.services/workflow.service';
import { TranslateService } from '@ngx-translate/core';

declare const $: any;
declare var PureJSCarousel: any;
declare var graphAdapter: any;
@Component({
    selector: 'app-templates-chat-history',
    templateUrl: './templates-chat-history.component.html',
    //   encapsulation: ViewEncapsulation.None,
    styleUrls: ['./templates-chat-history.component.scss']
})
export class TemplatesChatHistoryComponent implements OnInit {

    chatHistData: any = {
        messages: []
    };
    helpers = {
        'nl2br': function (str, runEmojiCheck) {
            if (runEmojiCheck) {
                // str = window.emojione.shortnameToImage(str);
            }
            str = str.replace(/(?:\r\n|\r|\n)/g, '<br />');
            return str;
        },
        'br2nl': function (str) {
            str = str.replace(/<br \/>/g, '\n');
            return str;
        },
        'formatAMPM': function (date) {
            var hours = date.getHours();
            var minutes = date.getMinutes();
            var seconds = date.getSeconds();
            var ampm = hours >= 12 ? 'pm' : 'am';
            hours = hours % 12;
            hours = hours ? hours : 12; // the hour '0' should be '12'
            minutes = minutes < 10 ? '0' + minutes : minutes;
            seconds = seconds < 10 ? '0' + seconds : seconds;
            var strTime = hours + ':' + minutes + ':' + seconds + ' ' + ampm;
            return strTime;
        },
        'formatDate': function (date) {
            var d = new Date(date);
            return d.toDateString() + " at " + this.formatAMPM(d);
        },
        'convertMDtoHTML': function (val, responseType) {
            function xssAttack(txtStr) {
                var textHasXSS;
                if (txtStr) {
                    textHasXSS = txtStr.isNotAllowedHTMLTags();
                }
                if (textHasXSS && !textHasXSS.isValid) {
                    txtStr = txtStr.escapeHTML();
                }
                return txtStr;
            }
            try {
                if (val.indexOf('{') > -1 && JSON.parse(val).payload?.template_type == 'live_agent') {
                    val = JSON.parse(val).payload.text;
                }
            } catch (err) {
                
            }
           

            var mdre: any = {};
            //mdre.date = new RegExp(/\\d\(\s*(.{10})\s*\)/g);
            mdre.date = new RegExp(/\\d\(\s*(.{10})\s*(?:,\s*["'](.+?)["']\s*)?\)/g);
            mdre.time = new RegExp(/\\t\(\s*(.{8}\.\d{0,3})\s*\)/g);
            //mdre.datetime = new RegExp(/\\dt\(\s*(.{10})[T](.{12})([z]|[Z]|[+-]\d{4})\s*\)/g);
            mdre.datetime = new RegExp(/\\(d|dt|t)\(\s*([-0-9]{10}[T][0-9:.]{12})([z]|[Z]|[+-]\d{4})[\s]*,[\s]*["']([a-zA-Z\W]+)["']\s*\)/g);
            mdre.num = new RegExp(/\\#\(\s*(\d*.\d*)\s*\)/g);
            mdre.curr = new RegExp(/\\\$\((\d*.\d*)[,](\s*[\"\']\s*\w{3}\s*[\"\']\s*)\)|\\\$\((\d*.\d*)[,](\s*\w{3}\s*)\)/g);

            var regEx: any = {};
            regEx.SPECIAL_CHARS = /[\=\`\~\!@#\$\%\^&\*\(\)_\-\+\{\}\:"\[\];\',\.\/<>\?\|\\]+/;
            regEx.EMAIL = /^[-a-z0-9~!$%^&*_=+}{\']+(\.[-a-z0-9~!$%^&*_=+}{\']+)*@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,255})+$/i;
            regEx.MENTION = /(^|\s|\\n|")@([^\s]*)(?:[\s]\[([^\]]*)\])?["]?/gi;
            regEx.HASHTAG = /(^|\s|\\n)#(\S+)/g;
            regEx.NEWLINE = /\n/g;
            var _regExForLink = /((?:http\:\/\/|https\:\/\/|www\.)+\S*\.(?:(?:\.\S)*[^\,\s\.])*\/?(?="))/gi;
            var _regExForMarkdownLink = /\[([^\]]+)\](|\s)+\(([^\)])+\)/g;
            var str = val || '';
            var mmntns: any = {};
            mmntns.sd = new RegExp(/^(d{1})[^d]|[^d](d{1})[^d]/g);
            mmntns.dd = new RegExp(/^(d{2})[^d]|[^d](d{2})[^d]/g);
            mmntns.fy = new RegExp(/(y{4})|y{2}/g);
            var regexkeys = Object.keys(mdre);
            function matchmap(regexval, stringval) {
                var da;
                var matches = [];
                while ((da = regexval.exec(stringval)) !== null) {
                    var keypair: any = {};
                    keypair.index = da.index;
                    keypair.matchexp = da[0];
                    if (da.length > 1) {
                        for (var n = 1; n < da.length; n++) {
                            var mstr = "matchval" + n.toString();
                            keypair[mstr] = da[n];
                        }
                    }
                    matches.push(keypair);
                }
                return matches;
            }
            function ucreplacer(match) {
                return match.toUpperCase();
            }
            for (var j = 0; j < regexkeys.length; j++) {
                var k;
                switch (regexkeys[j]) {
                    case 'date':
                        var strvald = str;
                        var datematcharray = matchmap(mdre.date, strvald);
                        if (datematcharray.length) {
                            for (k = 0; k < datematcharray.length; k++) {
                                //var fdate = moment(datematcharray[k].matchval).format('DD,dd,MM,YYY');
                                var fdate = new Date(datematcharray[k].matchval1).toLocaleDateString();
                                fdate = ' ' + fdate.toString() + ' ';
                                str = str.replace(datematcharray[k].matchexp.toString(), fdate);
                            }
                        }
                        break;
                    case 'time':
                        var strvalt = str;
                        var timematcharray = matchmap(mdre.time, strvalt);
                        if (timematcharray.length) {
                            for (k = 0; k < timematcharray.length; k++) {
                                var ftime = new Date(timematcharray[k].matchval1).toLocaleTimeString();
                                ftime = ' ' + ftime.toString() + ' ';
                                str = str.replace(timematcharray[k].matchexp.toString(), ftime);
                            }
                        }
                        break;
                    case 'datetime':
                        var strvaldt = str;
                        var dtimematcharray = matchmap(mdre.datetime, strvaldt);
                        if (dtimematcharray.length) {
                            for (k = 0; k < dtimematcharray.length; k++) {
                                var ms = '';
                                var mergekeylength = Object.keys(dtimematcharray[k]).length - 2;
                                for (var l = 2; l < mergekeylength; l++) {
                                    var keystr = "matchval" + l.toString();
                                    ms += dtimematcharray[k][keystr];
                                }
                                var foptionstring = "matchval" + mergekeylength.toString();
                                var fmtstr = dtimematcharray[k][foptionstring];
                                fmtstr = fmtstr.replace(mmntns.fy, ucreplacer);
                                fmtstr = fmtstr.replace(mmntns.dd, ucreplacer);
                                fmtstr = fmtstr.replace(mmntns.sd, ucreplacer);
                                //var fdtime = new Date(dtimematcharray[k].matchval).toLocaleString();
                                var fdtime = moment(ms).format(fmtstr);
                                fdtime = ' ' + fdtime.toString() + ' ';
                                str = str.replace(dtimematcharray[k].matchexp.toString(), fdtime);
                            }
                        }
                        break;
                    case 'num':
                        var strnumval = str;
                        var nummatcharray = matchmap(mdre.num, strnumval);
                        if (nummatcharray.length) {
                            for (k = 0; k < nummatcharray.length; k++) {
                                var fnum = Number(nummatcharray[k].matchval1).toLocaleString();
                                fnum = ' ' + fnum.toString() + ' ';
                                str = str.replace(nummatcharray[k].matchexp.toString(), fnum);
                            }
                        }
                        break;
                    case 'curr':
                        var strcurval = str;
                        var currmatcharray = matchmap(mdre.curr, strcurval);
                        // var browserLang = window.navigator.language || window.navigator.browserLanguage;
                        var browserLang = window.navigator.language;
                        var curcode = new RegExp(/\w{3}/);
                        if (currmatcharray.length) {
                            for (k = 0; k < currmatcharray.length; k++) {
                                var currops: any = {};
                                var fcode;
                                currops.style = 'currency';
                                if (currmatcharray[k].matchval2) {
                                    fcode = curcode.exec(currmatcharray[k].matchval2);
                                }
                                currops.currency = fcode[0].toString();
                                var fcurr = Number(currmatcharray[k].matchval1).toLocaleString(browserLang, currops);
                                //check for browser support if browser doesnot suppor we get the same value back and we append the currency Code
                                if (currmatcharray[k].matchval1.toString() === fcurr.toString()) {
                                    fcurr = ' ' + fcurr.toString() + ' ' + currops.currency;
                                } else {
                                    fcurr = ' ' + fcurr.toString() + ' ';
                                }
                                str = str.replace(currmatcharray[k].matchexp.toString(), fcurr);
                            }
                        }
                        break;
                }
            }
            function nextLnReplacer(match, p1, offset, string) {
                return "<br/>";
            }
            var nextln = regEx.NEWLINE;
            //str = xssAttack(str);
            function ignoreWords(str) {
                var _words = ['onclick', 'onmouse', 'onblur', 'onscroll', 'onStart'];
                _words.forEach(function (word) {
                    var regEx = new RegExp(word, "ig");
                    str = str.replace(regEx, "");
                });
                return str;
            }
            function linkreplacer(match, p1, offset, string) {
                var dummyString = string.replace(_regExForMarkdownLink, '[]');
                dummyString = ignoreWords(dummyString);
                if (dummyString.indexOf(match) !== -1) {
                    var _link = p1.indexOf('http') < 0 ? 'http://' + match : match, _target;
                    //_link = encodeURIComponent(_link);
                    _target = "target='_blank'";
                    return "<span class='isLink' readlink=\'" + _link + "\' ><a " + _target + " href=\'" + _link + "\'>" + match + "</a></span>";
                } else {
                    return match;
                }
            }
            //check for whether to linkify or not
            try {
                str = decodeURIComponent(str);
            } catch (e) {
                str = str || '';
            }
            var newStr = '', wrapper1;
            var _hasHref = false, x, aTags;
            if (responseType === 'user') {
                str = str.replace(/onerror=/gi, 'abc-error=');
                wrapper1 = document.createElement('div');
                newStr = str.replace(/“/g, '\"').replace(/”/g, '\"');
                newStr = newStr.replace(/</g, '&lt;').replace(/>/g, '&gt;');
                wrapper1.innerHTML = xssAttack(newStr);
                aTags = wrapper1.getElementsByTagName('a').length > 0 ? wrapper1.getElementsByTagName('a') : [];
                _hasHref = false;
                for (x = 0; x < aTags.length; x++) {
                    if (aTags[x].getAttribute('href').length > 0) {
                        _hasHref = true;
                        break;
                    }
                }
                if (_hasHref) {
                    str = newStr;
                } else {
                    str = newStr.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(_regExForLink, linkreplacer);
                }
            } else {
                wrapper1 = document.createElement('div');
                //str = str.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
                wrapper1.innerHTML = xssAttack(str);
                aTags = wrapper1.getElementsByTagName('a').length > 0 ? wrapper1.getElementsByTagName('a') : [];
                _hasHref = false;
                for (x = 0; x < aTags.length; x++) {
                    if (aTags[x].getAttribute('href').length > 0) {
                        _hasHref = true;
                        break;
                    }
                }
                if (_hasHref) {
                    var linkArray = str.match(/<a[^>]*>([^<]+)<\/a>/g);
                    for (x = 0; x < linkArray.length; x++) {
                        var _newLA = document.createElement('div');
                        _newLA.innerHTML = linkArray[x];
                        $(_newLA).find('a').attr('target', '_blank');
                        str = str.replace(linkArray[x], _newLA.innerHTML);
                    }
                } else {
                    str = wrapper1.innerHTML.replace(_regExForLink, linkreplacer);
                }
            }
            str = this.checkMarkdowns(str);
            if (responseType === 'user') {
                str = str.replace(/abc-error=/gi, 'onerror=');
            }
            return this.nl2br(str, true);
        },
        'checkMarkdowns': function (val) {
            var txtArr = val.split(/\r?\n/);
            for (var i = 0; i < txtArr.length; i++) {
                var _lineBreakAdded = false;
                if (txtArr[i].indexOf('#h6') === 0 || txtArr[i].indexOf('#H6') === 0) {
                    txtArr[i] = '<h6>' + txtArr[i].substring(3) + '</h6>';
                    _lineBreakAdded = true;
                } else if (txtArr[i].indexOf('#h5') === 0 || txtArr[i].indexOf('#H5') === 0) {
                    txtArr[i] = '<h5>' + txtArr[i].substring(3) + '</h5>';
                    _lineBreakAdded = true;
                } else if (txtArr[i].indexOf('#h4') === 0 || txtArr[i].indexOf('#H4') === 0) {
                    txtArr[i] = '<h4>' + txtArr[i].substring(3) + '</h4>';
                    _lineBreakAdded = true;
                } else if (txtArr[i].indexOf('#h3') === 0 || txtArr[i].indexOf('#H3') === 0) {
                    txtArr[i] = '<h3>' + txtArr[i].substring(3) + '</h3>';
                    _lineBreakAdded = true;
                } else if (txtArr[i].indexOf('#h2') === 0 || txtArr[i].indexOf('#H2') === 0) {
                    txtArr[i] = '<h2>' + txtArr[i].substring(3) + '</h2>';
                    _lineBreakAdded = true;
                } else if (txtArr[i].indexOf('#h1') === 0 || txtArr[i].indexOf('#H1') === 0) {
                    txtArr[i] = '<h1>' + txtArr[i].substring(3) + '</h1>';
                    _lineBreakAdded = true;
                } else if (txtArr[i].length === 0) {
                    txtArr[i] = '\r\n';
                    _lineBreakAdded = true;
                } else if (txtArr[i].indexOf('*') === 0) {
                    if (!this.isEven(txtArr[i].split('*').length - 1)) {
                        txtArr[i] = '\r\n&#9679; ' + txtArr[i].substring(1);
                        _lineBreakAdded = true;
                    }
                } else if (txtArr[i].indexOf('>>') === 0) {
                    txtArr[i] = '<p class="indent">' + txtArr[i].substring(2) + '</p>';
                    _lineBreakAdded = true;
                } else if (txtArr[i].indexOf('&gt;&gt;') === 0) {
                    txtArr[i] = '<p class="indent">' + txtArr[i].substring(8) + '</p>';
                    _lineBreakAdded = true;
                } else if (txtArr[i].indexOf('---') === 0 || txtArr[i].indexOf('___') === 0) {
                    txtArr[i] = '<hr/>' + txtArr[i].substring(3);
                    _lineBreakAdded = true;
                }
                var j;
                // Matches Image markup ![test](http://google.com/image.png)
                var _matchImage = txtArr[i].match(/\!\[([^\]]+)\](|\s)+\(([^\)])+\)/g);
                if (_matchImage && _matchImage.length > 0) {
                    for (j = 0; j < _matchImage.length; j++) {
                        var _imgTxt = _matchImage[j].substring(2, _matchImage[j].indexOf(']'));
                        remainingString = _matchImage[j].substring(_matchImage[j].indexOf(']') + 1).trim();
                        var _imgLink = remainingString.substring(1, remainingString.indexOf(')'));
                        _imgLink = '<img src="' + _imgLink + '" alt="' + _imgTxt + '"/>';
                        var _tempImg = txtArr[i].split(' ');
                        for (var k = 0; k < _tempImg.length; k++) {
                            if (_tempImg[k] === _matchImage[j]) {
                                _tempImg[k] = _imgLink;
                            }
                        }
                        txtArr[i] = _tempImg.join(' ');
                        //txtArr[i] = txtArr[i].replace(_matchImage[j], _imgLink);
                    }
                }
                // Matches link markup [test](http://google.com/)
                var _matchLink = txtArr[i].match(/\[([^\]]+)\](|\s)+\(([^\)])+\)/g);
                var remainingString;
                if (_matchLink && _matchLink.length > 0) {
                    for (j = 0; j < _matchLink.length; j++) {
                        var _linkTxt = _matchLink[j].substring(1, _matchLink[j].indexOf(']'));
                        remainingString = _matchLink[j].substring(_matchLink[j].indexOf(']') + 1).trim();
                        var _linkLink = remainingString.substring(1, remainingString.indexOf(')'));
                        _linkLink = '<span class="isLink" readlink="' + _linkLink + '"><a href="' + _linkLink + '" target="_blank">' + _linkTxt + '</a></span>';
                        txtArr[i] = txtArr[i].replace(_matchLink[j], _linkLink);
                    }
                }
                // Matches bold markup *test* doesnot match * test *, *test *, * test*. If all these are required then replace \S with \s
                var _matchAstrik = txtArr[i].match(/\*\S([^*]*?)\S\*/g);
                if (_matchAstrik && _matchAstrik.length > 0) {
                    for (j = 0; j < _matchAstrik.length; j++) {
                        var _boldTxt = _matchAstrik[j];
                        _boldTxt = _boldTxt.substring(1, _boldTxt.length - 1);
                        _boldTxt = '<b>' + _boldTxt + '</b>';
                        txtArr[i] = txtArr[i].replace(_matchAstrik[j], _boldTxt);
                    }
                }
                // Matches bold markup ~test~ doesnot match ~ test ~, ~test ~, ~ test~. If all these are required then replace \S with \s
                var _matchItalic = txtArr[i].match(/\~\S([^*]*?)\S\~/g);
                if (_matchItalic && _matchItalic.length > 0) {
                    for (j = 0; j < _matchItalic.length; j++) {
                        var _italicTxt = _matchItalic[j];
                        if (txtArr[i].indexOf(_italicTxt) === 0 || txtArr[i][txtArr[i].indexOf(_italicTxt) - 1] === ' ') {
                            _italicTxt = _italicTxt.substring(1, _italicTxt.length - 1);
                            _italicTxt = '<i class="markdownItalic">' + _italicTxt + '</i>';
                            txtArr[i] = txtArr[i].replace(_matchItalic[j], _italicTxt);
                        }
                    }
                }
                // Matches bold markup ~test~ doesnot match ~ test ~, ~test ~, ~ test~. If all these are required then replace \S with \s
                var _matchPre = txtArr[i].match(/\`\`\`\S([^*]*?)\S\`\`\`/g);
                var _matchPre1 = txtArr[i].match(/\'\'\'\S([^*]*?)\S\'\'\'/g);
                var _preTxt = "";
                if (_matchPre && _matchPre.length > 0) {
                    for (j = 0; j < _matchPre.length; j++) {
                        _preTxt = _matchPre[j];
                        _preTxt = _preTxt.substring(3, _preTxt.length - 3);
                        _preTxt = '<pre>' + _preTxt + '</pre>';
                        txtArr[i] = txtArr[i].replace(_matchPre[j], _preTxt);
                    }
                    _lineBreakAdded = true;
                }
                if (_matchPre1 && _matchPre1.length > 0) {
                    for (j = 0; j < _matchPre1.length; j++) {
                        _preTxt = _matchPre1[j];
                        _preTxt = _preTxt.substring(3, _preTxt.length - 3);
                        _preTxt = '<pre>' + _preTxt + '</pre>';
                        txtArr[i] = txtArr[i].replace(_matchPre1[j], _preTxt);
                    }
                    _lineBreakAdded = true;
                }
                if (!_lineBreakAdded && i > 0) {
                    txtArr[i] = '\r\n' + txtArr[i];
                }
            }
            val = txtArr.join('');
            return val;
        }
    };
    available_charts: any = [];
    msgId: string;
    msgIds: string[] = [];
    wavesurfer: WaveSurfer;
    audioVolume: number = 1;
    audioSpeed: number = 1;
    isWaveSurferRendered: boolean = false;
    audioURL: any;
    streamId: string;
    isAudioPlaying: boolean = false;
    isAudioMute: boolean = false;
    isLoadingAudio: boolean = false;
    audioURLList: any = [];
    audioIndex: number = 0;
    isRegionPlayingStart = false;

    isRegionCreated = false;
    @Input() chatData: any;
    @Input() isAgent: boolean;
    @Input() selectedLog: any = {};

    constructor(
        private service: ServiceInvokerService,
        public workflowService: workflowService,
        private translate: TranslateService
    ) { }

    ngOnInit(): void {
        this.streamId = this.workflowService.getCurrentBt()._id;
        this.chatHistData = this.chatData;
        if (this.selectedLog?.scId) {
            this.getAudioStream();
            console.log("bot name", this.workflowService.getCurrentBt(), this.selectedLog);
        }
    }

    miniTemplateFn = function (data) {
        $("[data-msg-id=" + data._id + "] .carousel").addClass("carousel" + this.carouselTemplateCount);
        var count = $("[data-msg-id=" + data._id + "] .carousel" + this.carouselTemplateCount).children().length;
        if (count > 1) {
            var carouselOneByOne = new PureJSCarousel({
                carousel: "[data-msg-id=" + data._id + "] .carousel" + this.carouselTemplateCount,
                slide: '.slide',
                oneByOne: true
            });
            $('.carousel' + this.carouselTemplateCount).parent().show();
            $('.carousel' + this.carouselTemplateCount).attr('style', 'height: 100% !important');
            this.carouselEles.push(carouselOneByOne);
        }
    };

    carouselTemplateFn = function (data) {
        $("[data-msg-id=" + data._id + "] .carousel").addClass("carousel" + this.carouselTemplateCount);
        var count = $("[data-msg-id=" + data._id + "] .carousel" + this.carouselTemplateCount).children().length;
        if (count > 1) {
            var carouselOneByOne = new PureJSCarousel({
                carousel: "[data-msg-id=" + data._id + "] .carousel" + this.carouselTemplateCount,
                slide: '.slide',
                oneByOne: true
            });
            $('.carousel' + this.carouselTemplateCount).parent().show();
            $('.carousel' + this.carouselTemplateCount).attr('style', 'height: 100% !important');
            this.carouselEles.push(carouselOneByOne);
        }
    };

    barChartFn = function (data) {
        var messageId = data._id;
        var msgData = JSON.parse(data.components[0].data.text);
        var barTemplateObj = {
            'message': [{
                'component': msgData
            }]
        };
        let dimens: any = {};
        dimens.outerWidth = 350;
        dimens.outerHeight = 300;
        dimens.innerHeight = 200;
        dimens.legendRectSize = 15;
        dimens.legendSpacing = 4;
        if (msgData.payload.direction === undefined) {
            msgData.payload.direction = 'horizontal';
        }
        if (msgData.payload.direction === 'horizontal' && !msgData.payload.stacked) {
            setTimeout(() => {
                dimens.innerWidth = 180;
                var _barchartObj = { 'id': 'Legend_barchart' + messageId, 'data': msgData, 'type': 'barchart' };
                this.available_charts.push(_barchartObj);
                graphAdapter.drawD3barHorizontalbarChart(barTemplateObj, dimens, '#barchart' + messageId, 12);
                // window.barchartCount = window.barchartCount + 1;
            }, 250);
        }
        else if (msgData.payload.direction === 'vertical' && msgData.payload.stacked) {
            setTimeout(() => {
                dimens.outerWidth = 400;
                dimens.innerWidth = 270;
                var _barchartObj = { 'id': 'barchart' + messageId, 'data': msgData, 'type': 'stackedBarchart' };
                this.available_charts.push(_barchartObj);
                graphAdapter.drawD3barVerticalStackedChart(barTemplateObj, dimens, '#barchart' + messageId, 12);
                // window.barchartCount = window.barchartCount + 1;
            }, 250);
        }

        else if (msgData.payload.direction === 'horizontal' && msgData.payload.stacked) {
            setTimeout(() => {
                dimens.innerWidth = 180;
                var _barchartObj = { 'id': 'barchart' + messageId, 'data': msgData, 'type': 'stackedBarchart' };
                this.available_charts.push(_barchartObj);
                graphAdapter.drawD3barStackedChart(barTemplateObj, dimens, '#barchart' + messageId, 12);
                // window.barchartCount = window.barchartCount + 1;
            }, 250);
        }
        else if (msgData.payload.direction === 'vertical' && !msgData.payload.stacked) {
            setTimeout(() => {
                dimens.innerWidth = 240;
                var _barchartObj = { 'id': 'barchart' + messageId, 'data': msgData, 'type': 'barchart' };
                this.available_charts.push(_barchartObj);
                graphAdapter.drawD3barChart(barTemplateObj, dimens, '#barchart' + messageId, 12);
                // window.barchartCount = window.barchartCount + 1;
            }, 250);
        }
    };

    pieChartFn = function (data) {
        var messageId = data._id;
        var msgData = JSON.parse(data.components[0].data.text);
        var pieTemplateObj = {
            'message': [{
                'component': msgData
            }]
        };
        if (msgData.payload.pie_type === undefined) {
            msgData.payload.pie_type = 'regular';
        }
        if (msgData.payload.pie_type) {
            // define data
            let dimens: any = {};
            dimens.width = 300;
            dimens.height = 200;
            dimens.legendRectSize = 10;
            dimens.legendSpacing = 2.4;
            if (msgData.payload.pie_type === "regular") {
                setTimeout(() => {
                    var _piechartObj = { 'id': 'piechart' + messageId, 'data': msgData, 'type': 'regular' };
                    this.available_charts.push(_piechartObj);
                    graphAdapter.drawD3Pie(pieTemplateObj, dimens, '#piechart' + messageId, 12);
                    //window.PieChartCount = window.PieChartCount + 1;
                }, 150);
            }
            else if (msgData.payload.pie_type === "donut") {
                setTimeout(() => {
                    var _piechartObj = { 'id': 'piechart' + messageId, 'data': msgData, 'type': 'donut' };
                    this.available_charts.push(_piechartObj);
                    graphAdapter.drawD3PieDonut(pieTemplateObj, dimens, '#piechart' + messageId, 12, 'donut');
                    //window.PieChartCount = window.PieChartCount + 1;
                }, 150);
            }
            else if (msgData.payload.pie_type === "donut_legend") {
                setTimeout(() => {
                    var _piechartObj = { 'id': 'piechart' + messageId, 'data': msgData, 'type': 'donut_legend' };
                    this.available_charts.push(_piechartObj);
                    graphAdapter.drawD3PieDonut(pieTemplateObj, dimens, '#piechart' + messageId, 12, 'donut_legend');
                    //window.PieChartCount = window.PieChartCount + 1;
                }, 150);
            }
        }
    };

    showJSON = function (message) {
        var jsonDomEle = document.getElementById('chatHistoryJson');
        if (jsonDomEle) {
            jsonDomEle.innerHTML = JSON.stringify(message, undefined, 2);
        }
        $('.jsonResponseContainer').show();
    };

    closeChatHistoryJsonModal = function () { $('.jsonResponseContainer').hide(); };

    lineChartFn = function (data) {
        var messageId = data._id;
        var msgData = JSON.parse(data.components[0].data.text);
        var lineTemplateObj = {
            'message': [{
                'component': msgData
            }]
        };
        setTimeout(() => {
            let dimens: any = {};
            dimens.outerWidth = 350;
            dimens.outerHeight = 350;
            dimens.innerWidth = 230;
            dimens.innerHeight = 250;
            dimens.legendRectSize = 15;
            dimens.legendSpacing = 4;
            var _linechartObj = { 'id': 'linechart' + messageId, 'data': msgData, 'type': 'linechart' };
            this.available_charts.push(_linechartObj);
            graphAdapter.drawD3lineChartV2(lineTemplateObj, dimens, '#linechart' + messageId, 12);
        }, 250);
    };

    getTemplate(msgData) {
        try {
            var data = msgData;
            if (data.channels[0].type === 'facebook') {
                var channelMsg = JSON.parse(data.components[0].data.text);
                msgData = channelMsg.attachment;
            } else {
                var templateData = msgData.components[0].data.text;
                msgData = JSON.parse(templateData);
            }
            if (msgData.payload && msgData.payload.template_type === 'button') {
                return $(buttonTemplate).tmpl({ 'msgData': msgData }).html();
            } else if (msgData.type === 'video' || msgData.type === 'audio' || msgData.type === 'link' || msgData.type === 'image') {
                msgData.extractedFileName = msgData.payload.url.replace(/^.*[\\\/]/, '');
                return $(templateAttachment).tmpl({ 'msgData': msgData }).html();
            } else if (msgData.type === 'error' || msgData.type === 'message') {
                return $(warningTemplate).tmpl({ 'msgData': msgData }).html();
            } else if (msgData.payload?.template_type === 'quick_replies') {
                return $(quickReplyTemplate).tmpl({ 'msgData': msgData }).html();
            } else if (msgData.payload?.template_type === 'list') {
                return $(listTemplate).tmpl({ 'msgData': msgData }).html();
            } else if (msgData && msgData.payload && msgData.payload.template_type === 'mini_table' && msgData.payload.layout === 'horizontal') {
                setTimeout(() => {
                    this.miniTemplateFn(data);
                });
                return $(miniTableHorizontalTemplate).tmpl({ 'msgData': msgData }).html();
            } else if (msgData && msgData.payload && msgData.payload.template_type === 'carousel' || msgData && msgData.payload && msgData.payload.template_type === 'generic') {
                setTimeout(() => {
                    this.carouselTemplateFn(data);
                });
                return $(carouselTemplate).tmpl({ 'msgData': msgData }).html();
            } else if (msgData && msgData.payload && msgData.payload.template_type === 'table') {
                setTimeout(() => {
                    if ($(".botchatHistoryContainer").width() == 504 || $(".botchatHistoryContainer").width() < 504) {
                        $(".accordionTable").each(function () {
                            if ($(this).hasClass("responsive")) {
                                $(this).addClass("hide");
                            }
                        });
                        $(".tablechartDiv").each(function () {
                            if (!$(this).hasClass("regular")) {
                                $(this).removeClass("hide");
                            }
                        });
                    }
                    else {
                        $(".accordionTable").each(function () {
                            if ($(this).hasClass("responsive")) {
                                $(this).removeClass("hide");
                            }
                        });
                        $(".tablechartDiv").each(function () {
                            if (!$(this).hasClass("regular")) {
                                $(this).addClass("hide");
                            }
                        });
                    }
                });
                return $(tableChartTemplate).tmpl({ 'msgData': msgData }).html();
            } else if (msgData && msgData.payload && msgData.payload.template_type === 'barchart') {
                setTimeout(() => {
                    this.barChartFn(data);
                });
                return $(barchartTemplate).tmpl({ 'msgData': msgData, 'data': data }).html();
            } else if (msgData && msgData.payload && msgData.payload.template_type === 'piechart') {
                setTimeout(() => {
                    this.pieChartFn(data);
                });
                return $(pieChartTemplate).tmpl({ 'msgData': msgData, 'data': data }).html();
            } else if (msgData && msgData.payload && msgData.payload.template_type === 'linechart') {
                setTimeout(() => {
                    this.lineChartFn(data);
                });
                return $(linechartTemplate).tmpl({ 'msgData': msgData, 'data': data }).html();
            }

            else {
                return '<span class="messageBubble">"' + "JavaScript Message" + '"</span>';
            }
        } catch (error) {
            console.log('template ', error);
            return '<span class="messageBubble">"' + "JavaScript Message" + '"</span>';
        }
    }

    renderTemplate = function (msgData, ele) {
        setTimeout(() => {
            var _msgTemp = this.getTemplate(msgData);
            $("[data-msg-id=" + msgData._id + "] .template").append(_msgTemp);
        }, 2000);
    };

    checkForTemplate(msg) {
        try {
            if (msg && msg.indexOf('{') !== -1) {
                if (JSON.parse(msg).payload?.template_type == 'live_agent') {
                    return false;
                }
                return true;
            } else {
                return false;
            }
        } catch (err) {
            return false;
        }
        
    };

    ngAfterContentChecked() {
        if (document.getElementById('waveform') && !this.isWaveSurferRendered) {
            this.isWaveSurferRendered = true;
            this.wavesurfer = WaveSurfer.create({
                container: document.getElementById('waveform'),
                waveColor: '#26344A',
                progressColor: 'rgba(0, 157, 171, 0.5)',
                splitChannels: true,
                mediaControls: false,
                // backend: "MediaElement",
                backgroundColor: '#E9EFF4',
                cursorColor: '#007D88',
                skipLength: 10,
                // barGap: 2,
                // barWidth: 2,
                // responsive: true,
                scrollParent: true,
                height: 50,
                // partialRender: true, // Caches the decoded peaks data to improve rendering speed for large audio
                plugins: [
                    Regions.create({
                        dragSelection: {
                            slop: 5
                        },
                    }),
                    Cursor.create({
                        showTime: true,
                        opacity: 1,
                        customShowTimeStyle: {
                            'background-color': '#000',
                            color: '#fff',
                            padding: '2px',
                            'font-size': '10px'
                        }
                    })
                ]
            });

            let self: any = this;
            this.wavesurfer.on('seek', function () {
                document.getElementById('waveform').addEventListener('click',()=>{
                    if(self.isRegionCreated){
                        self.wavesurfer.clearRegions();
                    }
                })
                
                
            });

            this.wavesurfer.on('region-created', function () {
                self.isRegionCreated = true;
                self.isRegionPlayingStart = false;
                self.wavesurfer.clearRegions();
            });


            this.wavesurfer.on('mute', function (value) {

            })

            this.wavesurfer.on('volume', function (volume) {
                if (volume) {
                    self.isAudioMute = false;
                } else {
                    self.isAudioMute = true;
                }
            })

            this.wavesurfer.on('pause', function () {
                self.isAudioPlaying = false;
            })

            this.wavesurfer.on('play', function () {
                self.isAudioPlaying = true;
            })

            this.wavesurfer.on('finish', function () {
                self.wavesurfer.stop();
                self.isAudioPlaying = false;
            });

            const interval = setInterval(() => {
                if (this.audioURL) {
                    this.wavesurfer.load(this.audioURL);
                    this.wavesurfer.setVolume(this.audioVolume);
                    clearInterval(interval);
                }
            }, 1000)
        }

    }

    play() {
        if (Object.keys(this.wavesurfer.regions.list)?.length) {
            Object.values(this.wavesurfer.regions.list).forEach(val => {
                if(this.isAudioPlaying){
                    this.wavesurfer.pause();
                    this.isRegionPlayingStart = true;
                }else{
                    if(!this.isRegionPlayingStart){
                        this.wavesurfer.play(val["start"], val["end"]);
                    }else{
                        let start = this.wavesurfer.getCurrentTime()>val['end']?val["start"]:this.wavesurfer.getCurrentTime();
                        this.wavesurfer.play(start, val["end"]);
                    }                  
                }
            });
        } else {
            this.wavesurfer.playPause();
        }
        this.isAudioPlaying = this.wavesurfer.isPlaying();
    }

    getAudioTime() {
        if (this.wavesurfer && this.wavesurfer.getDuration()) {
            let seconds: any = this.wavesurfer.getDuration();
            return `${(Math.floor(seconds / 60) < 10) ? ("0" + Math.floor(seconds / 60)) : Math.floor(seconds / 60)}:${Math.floor(seconds%60) < 10 ? ("0" + Math.floor(seconds%60)) : Math.floor(seconds%60)}`;
        }
    }

    getAudioRunningTime() {
        if (this.wavesurfer && this.wavesurfer.getDuration()) {
            let seconds: any = this.wavesurfer.getCurrentTime();
            return `${(Math.floor(seconds / 60) < 10) ? ("0" + Math.floor(seconds / 60)) : Math.floor(seconds / 60)}:${Math.floor(seconds%60) < 10 ? ("0" + Math.floor(seconds%60)) : Math.floor(seconds%60)}`;
        }
    }

    forward() {
        this.wavesurfer.skipForward();
    }

    backward() {
        this.wavesurfer.skipBackward();
    }

    onVolumeChange(event) {
        this.wavesurfer.setVolume(event.value);
    }

    download() {
        console.log("bot name", this.workflowService.getCurrentBt(), this.selectedLog);
        let fileName = this.workflowService.getCurrentBt().name + "_" + this.selectedLog.phoneNumber + "_" + this.selectedLog.startedOn.format('Do MMM, YYYY') + ".mp3";
        let a = document.createElement('a');
        a['href'] = this.audioURL;
        a['download'] = fileName;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    onAudioSpeedChange(value) {
        this.audioSpeed = value;
        this.wavesurfer.setPlaybackRate(this.audioSpeed);
    }

    ngDestory() {
        this.wavesurfer.unAll();
        this.wavesurfer.destroy();
    }

    getAudioStream() {
        this.isLoadingAudio = true;
        this.service.invoke('get.conversation.callrecoding', { streamId: this.streamId, recordingId: this.selectedLog.scId }).subscribe(
            res => {
                this.isLoadingAudio = false;
                this.audioURLList = res?.recording;
                this.audioURL = res?.recording[this.audioIndex];
            }, err => {
                this.isLoadingAudio = false;
            }
        );
    }

    setMute(value) {
        this.wavesurfer.setMute(value);
        this.isAudioMute = value;
    }

    playPrevious() {
        this.audioIndex--;
        this.wavesurfer.stop();
        this.audioURL = this.audioURLList[this.audioIndex];
        this.wavesurfer.load(this.audioURL);
        setTimeout(() => {
            this.wavesurfer.play();
        }, 1000);
    }

    playNext() {
        this.audioIndex++;
        this.wavesurfer.stop();
        this.audioURL = this.audioURLList[this.audioIndex];
        this.wavesurfer.load(this.audioURL);
        setTimeout(() => {
            this.wavesurfer.play();
        }, 1000);
    }

}
