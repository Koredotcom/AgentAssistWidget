export var buttonTemplate =  '<script id="chat_message_tmpl" type="text/x-jqury-tmpl"> \
{{if msgData.payload}} \
    <li class = "fromCurrentUser with-icon"> \
        <div class="buttonTmplContent"> \
            <ul class="buttonTmplContentBox">\
                <li class="buttonTmplContentHeading"> \
                    ${msgData.payload.text} \
                </li>\
                {{each(key, msgItem) msgData.payload.buttons}} \
                    <li {{if msgItem.payload}} value="${msgItem.payload}" {{/if}} {{if msgItem.payload}} actual-value="${msgItem.payload}"{{/if}} {{if msgItem.url}}url="${msgItem.url}"{{/if}} class="buttonTmplContentChild" data-value="${msgItem.value}" type="${msgItem.type}">\
                        ${msgItem.title}\
                    </li> \
                {{/each}} \
            </ul>\
        </div>\
    </li> \
{{/if}} \
</script>';

export var templateAttachment = '<script id="chat_message_tmpl" type="text/x-jqury-tmpl"> \
{{if msgData.payload}} \
{{each(key, msgItem) msgData.payload}} \
    <li class = "fromCurrentUser with-icon"> \
        {{if msgData.payload}} \
            <div class="messageBubble"> \
                <div class="msgCmpt botResponseAttachments" fileid="${msgData.payload.url}"> \
                    <div class="uploadedFileIcon"> \
                        {{if msgData.type == "image"}} \
                            <span class="icon cf-icon icon-photos_active"></span> \
                        {{else msgData.type == "audio"}}\
                            <span class="icon cf-icon icon-files_audio"></span> \
                        {{else msgData.type == "video"}} \
                            <span class="icon cf-icon icon-video_active fa fa-video-camera"></span> \
                        {{else msgData.type == "error"}} \
                        <span class="icon cf-icon icon-video_active fa fa-video-camera"></span> \
                        {{else}} \
                            {{if extension[1]=="xlsx" || extension[1]=="xls" || extension[1]=="docx" || extension[1]=="doc" || extension[1]=="pdf" || extension[1]=="ppsx" || extension[1]=="pptx" || extension[1]=="ppt" || extension[1]=="zip" || extension[1]=="rar"}}\
                                <span class="icon cf-icon icon-files_${extension[1]}"></span> \
                            {{else extension[1]}}\
                                <span class="icon cf-icon icon-files_other_doc"></span> \
                            {{/if}}\
                        {{/if}}\
                    </div> \
                    <div class="botuploadedFileName">${msgData.extractedFileName}</div> \
                </div> \
            </div> \
        {{/if}} \
    </li> \
{{/each}} \
{{/if}} \
</script>';

export var warningTemplate = '<script id="chat_message_tmpl" type="text/x-jqury-tmpl"> \
{{if msgData.type  && msgData.type =="error"}} \
<div><span class="warningColor">${msgData.payload.text} </span></div>\
{{else}} \
{{if msgData && msgData.payload && msgData.payload.videoUrl}}\
    <div class="messageBubble"> \
        <div class="videoEle"><video width="250" controls><source src="${msgData.payload.videoUrl}" type="video/mp4"></video></div>\
    </div> \
{{/if}}\
{{/if}} \
</script> ';

export var quickReplyTemplate = '<script id="chat_message_tmpl" type="text/x-jqury-tmpl"> \
{{if msgData.payload}} \
<div> \
    <li class = "fromCurrentUser with-icon quickReplies"> \
        <div class="buttonTmplContent"> \
            {{if msgData.payload.text}} \
                <div class="buttonTmplContentHeading quickReply"> \
                    ${msgData.payload.text}\
                </div>\
            {{/if}} \
            {{if msgData.payload && msgData.payload.quick_replies && msgData.payload.quick_replies.length }} \
                <div class="fa fa-chevron-left quickreplyLeftIcon hide"></div><div class="fa fa-chevron-right quickreplyRightIcon hide"></div>\
                    <div class="quick_replies_btn_parent"><div class="autoWidth">\
                        {{each(key, msgItem) msgData.payload.quick_replies}} \
                            <div class="buttonTmplContentChild quickReplyDiv"> <span {{if msgItem.payload}}value="${msgItem.payload}"{{/if}} class="quickReply {{if msgItem.image_url}}with-img{{/if}}" type="${msgItem.content_type}">\
                                {{if msgItem.image_url}}<img src="${msgItem.image_url}">{{/if}} <span class="quickreplyText {{if msgItem.image_url}}with-img{{/if}}">${msgItem.title}</span></span>\
                            </div> \
                        {{/each}} \
                    </div>\
                </div>\
            {{/if}} \
        </div>\
    </li> \
</div> \
{{/if}} \
</script>';

export var listTemplate = '<script id="chat_message_tmpl" type="text/x-jqury-tmpl"> \
{{if msgData.payload}} \
<li class = "fromCurrentUser with-icon"> \
    <div class="listTmplContent"> \
        <ul class="listTmplContentBox"> \
            {{if msgData.payload.title || msgData.payload.heading}} \
                <li class="listTmplContentHeading"> \
                    ${msgData.payload.heading} \
                </li> \
            {{/if}} \
            {{each(key, msgItem) msgData.payload.elements}} \
                {{if msgData.payload.buttons}} \
                    {{if key<= 2 }}\
                        <li class="listTmplContentChild"> \
                            {{if msgItem.image_url}} \
                                <div class="listRightContent" {{if msgItem.default_action && msgItem.default_action.url}}url="${msgItem.default_action.url}"{{/if}} {{if msgItem.default_action && msgItem.default_action.title}}data-value="${msgItem.default_action.title}"{{/if}} {{if msgItem.default_action && msgItem.default_action.type}}type="${msgItem.default_action.type}"{{/if}} {{if msgItem.default_action && msgItem.default_action.payload}} value="${msgItem.default_action.payload}"{{/if}}> \
                                    <img alt="image" src="${msgItem.image_url}" onerror="this.onerror=null;this.src=\'../libs/img/no_image.png\';"/> \
                                </div> \
                            {{/if}} \
                            <div class="listLeftContent"> \
                                <div class="listItemTitle">${msgItem.title} \
                                {{if msgItem.subtitle}}<div class="listItemSubtitle">${msgItem.subtitle}</div>{{/if}} \
                                {{if msgItem.default_action && msgItem.default_action.url}}<div class="listItemPath" type="url" url="${msgItem.default_action.url}">${msgItem.default_action.url}</div>{{/if}} \
                                {{if msgItem.buttons}}\
                                <div> \
                                    <span class="buyBtn" {{if msgItem.buttons[0].type}}type="${msgItem.buttons[0].type}"{{/if}} {{if msgItem.buttons[0].url}}url="${msgItem.buttons[0].url}"{{/if}} {{if msgItem.buttons[0].payload}}value="${msgItem.buttons[0].payload}"{{/if}}>{{if msgItem.buttons[0].title}}${msgItem.buttons[0].title}{{else}}Buy{{/if}}</span> \
                                </div> \
                                {{/if}}\
                            </div>\
                        </li> \
                    {{/if}}\
                {{else}} \
                    <li class="listTmplContentChild"> \
                        {{if msgItem.image_url}} \
                            <div class="listRightContent" {{if msgItem.default_action && msgItem.default_action.url}}url="${msgItem.default_action.url}"{{/if}} {{if msgItem.default_action && msgItem.default_action.title}}data-value="${msgItem.default_action.title}"{{/if}} {{if msgItem.default_action && msgItem.default_action.type}}type="${msgItem.default_action.type}"{{/if}} {{if msgItem.default_action && msgItem.default_action.payload}} value="${msgItem.default_action.payload}"{{/if}}> \
                                <img alt="image" src="${msgItem.image_url}" onerror="this.onerror=null;this.src=\'../libs/img/no_image.png\';" /> \
                            </div> \
                        {{/if}} \
                        <div class="listLeftContent"> \
                            <div class="listItemTitle">${msgItem.title}</div> \
                            {{if msgItem.subtitle}}<div class="listItemSubtitle">${msgItem.subtitle}</div>{{/if}} \
                            {{if msgItem.default_action && msgItem.default_action.url}}<div class="listItemPath" type="url" url="${msgItem.default_action.url}">${msgItem.default_action.url}</div>{{/if}} \
                            {{if msgItem.buttons}}\
                            <div> \
                                <span class="buyBtn" {{if msgItem.buttons[0].type}}type="${msgItem.buttons[0].type}"{{/if}} {{if msgItem.buttons[0].url}}url="${msgItem.buttons[0].url}"{{/if}} {{if msgItem.buttons[0].payload}}value="${msgItem.buttons[0].payload}"{{/if}}>{{if msgItem.buttons[0].title}}${msgItem.buttons[0].title}{{else}}Buy{{/if}}</span> \
                            </div> \
                            {{/if}}\
                        </div>\
                    </li> \
                {{/if}} \
            {{/each}} \
            </li> \
            {{if msgData.AlwaysShowGlobalButtons || (msgData && msgData.payload.elements.length > 3 && msgData.payload.buttons)}}\
                <li class="viewMoreList"> \
                    <span class="viewMore" url="{{if msgData.payload.buttons[0].url}}${msgData.payload.buttons[0].url}{{/if}}" type="${msgData.payload.buttons[0].type}" value="{{if msgData.payload.buttons[0].payload}}${msgData.payload.buttons[0].payload}{{else}}${msgData.payload.buttons[0].title}{{/if}}">${msgData.payload.buttons[0].title}</span> \
                </li> \
            {{/if}}\
        </ul> \
    </div> \
</li> \
{{/if}} \
</script>';

export var miniTableHorizontalTemplate = '<script id="chat_message_tmpl" type="text/x-jqury-tmpl"> \
{{if msgData.payload}} \
<li class="fromCurrentUser with-icon tablechart"> \
    {{if msgData.payload.text}} \
        <div class="messageBubble tableChart">\
            <span>${msgData.payload.text}</span>\
        </div> \
    {{/if}}\
    <div class="mini_template carousel" id="carousel-one-by-one" style="height: 0px;">\
        {{each(key, table) msgData.payload.elements}}\
            <div class="slide">\
                <div class="minitableDiv">\
                    <div style="overflow-x:auto; padding: 0 8px;">\
                        <table cellspacing="0" cellpadding="0">\
                            <tr class="headerTitle">\
                                {{each(key, tableHeader) table.primary}} \
                                    <th {{if tableHeader[1]}}style="text-align:${tableHeader[1]};" {{/if}}>${tableHeader[0]}</th>\
                                {{/each}} \
                            </tr>\
                            {{each(key, additional) table.additional}} \
                                <tr>\
                                    {{each(cellkey, cellValue) additional}} \
                                        <td  {{if cellkey === additional.length-1}}colspan="2"{{/if}}  {{if table.primary[cellkey][1]}}style="text-align:${table.primary[cellkey][1]};" {{/if}}>${cellValue}</td>\
                                    {{/each}} \
                                </tr>\
                            {{/each}} \
                        </table>\
                    </div>\
                </div>\
            </div>\
        {{/each}}\
    </div>\
</li> \
{{/if}} \
</script>';

export var carouselTemplate = '<script id="chat_message_tmpl" type="text/x-jqury-tmpl"> \
{{if msgData.payload}} \
<li class = "fromCurrentUser with-icon"> \
    <div class="carousel" id="carousel-one-by-one" style="height: 0px;">\
        {{each(key, msgItem) msgData.payload.elements}} \
            <div class="slide">\
                {{if msgItem.image_url}} \
                    <div class="carouselImageContent" {{if msgItem.default_action && msgItem.default_action.url}}url="${msgItem.default_action.url}"{{/if}} {{if msgItem.default_action && msgItem.default_action.title}}data-value="${msgItem.default_action.title}"{{/if}} {{if msgItem.default_action && msgItem.default_action.type}}type="${msgItem.default_action.type}"{{/if}} {{if msgItem.default_action && msgItem.default_action.payload}} value="${msgItem.default_action.payload}"{{/if}}> \
                        <img alt="image" src="${msgItem.image_url}" onerror="this.onerror=null;this.src=\'../libs/img/no_image.png\';"/> \
                    </div> \
                {{/if}} \
                <div class="carouselTitleBox"> \
                    <p class="carouselTitle"> ${msgItem.title}</p> \
                    {{if msgItem.subtitle}}<p class="carouselDescription">${msgItem.subtitle}</p>{{/if}} \
                    {{if msgItem.default_action && msgItem.default_action.type === "web_url"}}<div class="listItemPath carouselDefaultAction" type="url" url="${msgItem.default_action.url}">${msgItem.default_action.url}</div>{{/if}} \
                    {{if msgItem.buttons}} \
                        {{each(key, msgBtn) msgItem.buttons}} \
                            <div {{if msgBtn.payload}}value="${msgBtn.payload}"{{/if}} {{if msgBtn.url}}url="${msgBtn.url}"{{/if}} class="listItemPath carouselButton" data-value="${msgBtn.value}" type="${msgBtn.type}">\
                                ${msgBtn.title}\
                            </div> \
                        {{/each}} \
                    {{/if}} \
                </div>\
            </div>\
        {{/each}} \
    </div>\
</li> \
{{/if}}\
</script>';

export var tableChartTemplate = '<script id="chat_message_tmpl" type="text/x-jqury-tmpl"> \
{{if msgData.payload}} \
<li class ="fromCurrentUser with-icon tablechart"> \
    <div class="tablechartDiv {{if msgData.payload.table_design && msgData.payload.table_design == "regular"}}regular{{else}}hide{{/if}}">\
        <div style="overflow-x:auto; padding: 0 8px;">\
            <table cellspacing="0" cellpadding="0">\
                <tr class="headerTitle">\
                    {{each(key, tableHeader) msgData.payload.columns}} \
                        <th {{if tableHeader[1]}}style="text-align:${tableHeader[1]};"{{/if}}>${tableHeader[0]}</th>\
                    {{/each}} \
                </tr>\
                {{each(key, tableRow) msgData.payload.elements}} \
                    {{if tableRow.Values.length>1}}\
                        <tr {{if key > 4}}class="hide"{{/if}}>\
                            {{each(cellkey, cellValue) tableRow.Values}} \
                                <td  {{if cellkey === tableRow.Values.length-1}}colspan="2"{{/if}} class=" {{if key == 0}} addTopBorder {{/if}}" {{if msgData.payload.columns[cellkey][1]}}style="text-align:${msgData.payload.columns[cellkey][1]};" {{/if}}>${cellValue}</td>\
                            {{/each}} \
                        </tr>\
                    {{/if}}\
                {{/each}} \
            </table>\
        </div>\
        {{if msgData.payload.elements.length > 4 && msgData.payload.table_design && msgData.payload.table_design == "regular"}}<div class="showMore">Show more</div>{{/if}}\
    </div>\
    <div class="accordionTable {{if msgData.payload.table_design && msgData.payload.table_design == "regular"}}hide{{else}}responsive{{/if}}">\
        {{each(key, tableRow) msgData.payload.elements}} \
            {{if key < 4}}\
                <div class="accordionRow">\
                    {{each(cellkey, cellValue) tableRow.Values}} \
                        {{if cellkey < 2}}\
                            <div class="accordionCol">\
                                <div class="colTitle hideSdkEle">${msgData.payload.columns[cellkey][0]}</div>\
                                <div class="colVal">${cellValue}</div>\
                            </div>\
                        {{else}}\
                            <div class="accordionCol hideSdkEle">\
                                <div class="colTitle">${msgData.payload.columns[cellkey][0]}</div>\
                                <div class="colVal">${cellValue}</div>\
                            </div>\
                        {{/if}}\
                    {{/each}} \
                    <span class="fa fa-caret-right tableBtn"></span>\
                </div>\
            {{/if}}\
        {{/each}} \
        <div class="showMore">Show more</div>\
    </div>\
</li> \
{{/if}} \
</script>';

export var barchartTemplate = '<script id="chat_message_tmpl" type="text/x-jqury-tmpl"> \
{{if msgData.payload}} \
<li class="fromCurrentUser with-icon barchart"> \
    {{if msgData.payload.text}} \
        <div class="messageBubble barchart">\
            <span>${msgData.payload.text}</span>\
        </div> \
    {{/if}}\
    <div class="barchartDiv">\
    <div class="lineChartChildDiv" id="barchart${data._id}"></div>\
    </div>\
</li> \
{{/if}} \
</script>';

export var pieChartTemplate = '<script id="chat_message_tmpl" type="text/x-jqury-tmpl"> \
{{if msgData.payload}} \
<li class = "fromCurrentUser with-icon piechart"> \
    {{if msgData.payload.text}}\
        <div class="messageBubble pieChart">\
            <span>${msgData.payload.text}</span>\
        </div> \
    {{/if}}\
    <div class="piechartDiv">\
        <div class="lineChartChildDiv" id="piechart${data._id}"></div>\
    </div>\
</li> \
{{/if}} \
</script>';

export var linechartTemplate = '<script id="chat_message_tmpl" type="text/x-jqury-tmpl"> \
{{if msgData.payload}} \
<li class ="fromCurrentUser with-icon linechart"> \
    {{if msgData.payload.text}}\
        <div class="messageBubble linechart">\
            <span>${msgData.payload.text}</span>\
        </div> \
    {{/if}}\
    <div class="linechartDiv">\
        <div class="lineChartChildDiv" id="linechart${data._id}"></div>\
    </div>\
</li> \
{{/if}} \
</script>';