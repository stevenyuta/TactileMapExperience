/***************************************************************************
//path（記号も含めた）と点字＆記号との距離間を計算し、近すぎないか判定する関数
****************************************************************************/
function distance_check(){
  draw.select('.path').each(function(i , children){
    let stroke_width = this.attr('stroke-width');
    if(this.visible() && stroke_width !== 0){
      var p4oint = get_p4oint(this);
      var self = this; //比較にするpathのid
      for(var j=0; j< p4oint.length; j++){
        var four_point = new Array();
        for(var k=0; k<4; k++){
          four_point[k] = new Array();
        }
        four_point[0][0] = p4oint[j].x0 , four_point[0][1] = p4oint[j].y0;
        four_point[1][0] = p4oint[j].x1 , four_point[1][1] = p4oint[j].y1;
        four_point[2][0] = p4oint[j].x2 , four_point[2][1] = p4oint[j].y2;
        four_point[3][0] = p4oint[j].x3 , four_point[3][1] = p4oint[j].y3;
  /**
        draw.circle(3.5).attr({'cx' : four_point[0][0]}).attr({'cy' : four_point[0][1]}).attr({'fill' : 'red'})
        draw.circle(3.5).attr({'cx' : four_point[1][0]}).attr({'cy' : four_point[1][1]}).attr({'fill' : 'blue'})
        draw.circle(3.5).attr({'cx' : four_point[2][0]}).attr({'cy' : four_point[2][1]}).attr({'fill' : 'green'})
        draw.circle(3.5).attr({'cx' : four_point[3][0]}).attr({'cy' : four_point[3][1]}).attr({'fill' : 'yellow'})
  **/
        for(var k=0; k<4; k++){
          if(k!==3){
            var fp0x = four_point[k][0] , fp0y = four_point[k][1];
            var fp1x = four_point[k+1][0] , fp1y = four_point[k+1][1];
            var lp = getLineParam(fp0x , fp0y , fp1x , fp1y);
          }else{
            var fp0x = four_point[k][0] , fp0y = four_point[k][1];
            var fp1x = four_point[0][0] , fp1y = four_point[0][1];
            var lp = getLineParam(fp0x , fp0y , fp1x , fp1y);
          }
          //点字との距離を計算し、近すぎないか判定
          draw.select('.braille').each(function(l , children){
            var distance_flg = false; //true時：距離が近すぎる
            var braille_p4oint = get_p4oint(this);

            var b1x = Number(braille_p4oint[0].x0) , b1y = Number(braille_p4oint[0].y0);
            var b2x = Number(braille_p4oint[0].x1) , b2y = Number(braille_p4oint[0].y1);
            var b3x = Number(braille_p4oint[0].x2) , b3y = Number(braille_p4oint[0].y2);
            var b4x = Number(braille_p4oint[0].x3) , b4y = Number(braille_p4oint[0].y3);

            var distance1 = Math.abs(lp.a * b1x + lp.b * b1y + lp.c)/Math.sqrt(lp.a * lp.a + lp.b * lp.b);
            var distance2 = Math.abs(lp.a * b2x + lp.b * b2y + lp.c)/Math.sqrt(lp.a * lp.a + lp.b * lp.b);
            var distance3 = Math.abs(lp.a * b3x + lp.b * b3y + lp.c)/Math.sqrt(lp.a * lp.a + lp.b * lp.b);
            var distance4 = Math.abs(lp.a * b4x + lp.b * b4y + lp.c)/Math.sqrt(lp.a * lp.a + lp.b * lp.b);

            var relativeXY = get_relativeXY(fp0x ,fp0y, fp1x , fp1y , THRE_DISTANCE); //直線の領域のx,y座標

            if(distance1 < THRE_DISTANCE){
              if(b1x < relativeXY.max_x && b1x > relativeXY.min_x && b1y < relativeXY.max_y && b1y > relativeXY.min_y){
                this.addClass('distance_check');
                if(self.hasClass('symbol'))self.addClass('distance_check');
              }
            }
            if(distance2 < THRE_DISTANCE){
              if(b2x < relativeXY.max_x && b2x > relativeXY.min_x && b2y < relativeXY.max_y && b2y > relativeXY.min_y){
                this.addClass('distance_check');
                if(self.hasClass('symbol'))self.addClass('distance_check');
              }
            }
            if(distance3 < THRE_DISTANCE){
              if(b3x < relativeXY.max_x && b3x > relativeXY.min_x && b3y < relativeXY.max_y && b3y > relativeXY.min_y){
                this.addClass('distance_check');
                if(self.hasClass('symbol'))self.addClass('distance_check');
              }
            }
            if(distance4 < THRE_DISTANCE){
              if(b4x < relativeXY.max_x && b4x > relativeXY.min_x && b4y < relativeXY.max_y && b4y > relativeXY.min_y){
                this.addClass('distance_check');
                if(self.hasClass('symbol'))self.addClass('distance_check');
              }
            }
          })

          //記号との距離を計算し、近すぎないか判定
          draw.select('.symbol').each(function(i , children){
            let stroke_width = this.attr('stroke-width');
            if(self.attr('id') !== this.attr('id') && this.visible() && stroke_width !== 0){
              var symbol_p4oint = get_p4oint(this);
              for(var l=0; l< symbol_p4oint.length; l++){
                var b1x = Number(symbol_p4oint[l].x0) , b1y = Number(symbol_p4oint[l].y0);
                var b2x = Number(symbol_p4oint[l].x1) , b2y = Number(symbol_p4oint[l].y1);
                var b3x = Number(symbol_p4oint[l].x2) , b3y = Number(symbol_p4oint[l].y2);
                var b4x = Number(symbol_p4oint[l].x3) , b4y = Number(symbol_p4oint[l].y3);

                var distance1 = Math.abs(lp.a * b1x + lp.b * b1y + lp.c)/Math.sqrt(lp.a * lp.a + lp.b * lp.b);
                var distance2 = Math.abs(lp.a * b2x + lp.b * b2y + lp.c)/Math.sqrt(lp.a * lp.a + lp.b * lp.b);
                var distance3 = Math.abs(lp.a * b3x + lp.b * b3y + lp.c)/Math.sqrt(lp.a * lp.a + lp.b * lp.b);
                var distance4 = Math.abs(lp.a * b4x + lp.b * b4y + lp.c)/Math.sqrt(lp.a * lp.a + lp.b * lp.b);

                var relativeXY = get_relativeXY(fp0x ,fp0y, fp1x , fp1y , THRE_DISTANCE); //直線の領域のx,y座標

                if(distance1 < THRE_DISTANCE){
                  if(b1x < relativeXY.max_x && b1x > relativeXY.min_x && b1y < relativeXY.max_y && b1y > relativeXY.min_y){
                    this.addClass('distance_check');
                    if(self.hasClass('symbol'))self.addClass('distance_check');
                  }
                }
                if(distance2 < THRE_DISTANCE){
                  if(b2x < relativeXY.max_x && b2x > relativeXY.min_x && b2y < relativeXY.max_y && b2y > relativeXY.min_y){
                    this.addClass('distance_check');
                    if(self.hasClass('symbol'))self.addClass('distance_check');
                  }
                }
                if(distance3 < THRE_DISTANCE){
                  if(b3x < relativeXY.max_x && b3x > relativeXY.min_x && b3y < relativeXY.max_y && b3y > relativeXY.min_y){
                    this.addClass('distance_check');
                    if(self.hasClass('symbol'))self.addClass('distance_check');
                  }
                }
                if(distance4 < THRE_DISTANCE){
                  if(b4x < relativeXY.max_x && b4x > relativeXY.min_x && b4y < relativeXY.max_y && b4y > relativeXY.min_y){
                    this.addClass('distance_check');
                    if(self.hasClass('symbol'))self.addClass('distance_check');
                  }
                }
              }
            }
          })
          //円記号との距離を計算し、近すぎないか判定
          draw.select('.circle').each(function(i , children){
            let stroke_width = this.attr('stroke-width');
            if(this.visible() && stroke_width !== 0){
              var cx = Number(this.attr('cx')) , cy = Number(this.attr('cy')); //円の中心座標
              var cr = Number(this.attr('r')); //円の半径

              var Unit_a = lp.a/Math.sqrt(lp.a * lp.a + lp.b * lp.b); //単位方向ベクトル
              var Unit_b = lp.b/Math.sqrt(lp.a * lp.a + lp.b * lp.b);
              var b1x = cx + Unit_a * cr , b1y = cy + Unit_b * cr;

              var dif_0x = fp0x - cx , dif_0y = fp0y - cy;
              var dif_1x = fp1x - cx , dif_1y = fp1y - cy;

              var distance1 = Math.abs(lp.a * b1x + lp.b * b1y + lp.c)/Math.sqrt(lp.a * lp.a + lp.b * lp.b);
              var distance2 = Math.sqrt(dif_0x * dif_0x + dif_0y * dif_0y) - cr;
              var distance3 = Math.sqrt(dif_1x * dif_1x + dif_1y * dif_1y) - cr;

              var relativeXY = get_relativeXY(fp0x ,fp0y, fp1x , fp1y , THRE_DISTANCE); //直線の領域のx,y座標

              if(distance1 < THRE_DISTANCE){
                if(b1x < relativeXY.max_x && b1x > relativeXY.min_x && b1y < relativeXY.max_y && b1y > relativeXY.min_y){
                  this.addClass('distance_check');
                  if(self.hasClass('symbol'))self.addClass('distance_check');
                }
              }
              if(distance2 < THRE_DISTANCE){
                this.addClass('distance_check');
                if(self.hasClass('symbol'))self.addClass('distance_check');
              }
              if(distance3 < THRE_DISTANCE){
                this.addClass('distance_check');
                if(self.hasClass('symbol'))self.addClass('distance_check');
              }
            }
          })
        }
      }
    }
  })

  draw.select('.braille').each(function(i , children){
    if(this.visible()){
      var braille_p4oint = get_p4oint(this);
      var self = this; //比較にする点字のid
      var four_point = new Array();
      for(var k=0; k<4; k++){
        four_point[k] = new Array();
      }
      four_point[0][0] = Number(braille_p4oint[0].x0) , four_point[0][1] = Number(braille_p4oint[0].y0);
      four_point[1][0] = Number(braille_p4oint[0].x1) , four_point[1][1] = Number(braille_p4oint[0].y1);
      four_point[2][0] = Number(braille_p4oint[0].x2) , four_point[2][1] = Number(braille_p4oint[0].y2);
      four_point[3][0] = Number(braille_p4oint[0].x3) , four_point[3][1] = Number(braille_p4oint[0].y3);

      for(var k=0; k<4; k++){
        if(k!==3){
          var fp0x = four_point[k][0] , fp0y = four_point[k][1];
          var fp1x = four_point[k+1][0] , fp1y = four_point[k+1][1];
          var lp = getLineParam(fp0x , fp0y , fp1x , fp1y);
        }else{
          var fp0x = four_point[k][0] , fp0y = four_point[k][1];
          var fp1x = four_point[0][0] , fp1y = four_point[0][1];
          var lp = getLineParam(fp0x , fp0y , fp1x , fp1y);
        }

        //点字との距離を計算し、近すぎないか判定
        draw.select('.braille').each(function(l , children){
          if(self.attr('id') !== this.attr('id') && this.visible()){
            var distance_flg = false; //true時：距離が近すぎる
            var braille_p4oint = get_p4oint(this);

            var b1x = Number(braille_p4oint[0].x0) , b1y = Number(braille_p4oint[0].y0);
            var b2x = Number(braille_p4oint[0].x1) , b2y = Number(braille_p4oint[0].y1);
            var b3x = Number(braille_p4oint[0].x2) , b3y = Number(braille_p4oint[0].y2);
            var b4x = Number(braille_p4oint[0].x3) , b4y = Number(braille_p4oint[0].y3);

            var distance1 = Math.abs(lp.a * b1x + lp.b * b1y + lp.c)/Math.sqrt(lp.a * lp.a + lp.b * lp.b);
            var distance2 = Math.abs(lp.a * b2x + lp.b * b2y + lp.c)/Math.sqrt(lp.a * lp.a + lp.b * lp.b);
            var distance3 = Math.abs(lp.a * b3x + lp.b * b3y + lp.c)/Math.sqrt(lp.a * lp.a + lp.b * lp.b);
            var distance4 = Math.abs(lp.a * b4x + lp.b * b4y + lp.c)/Math.sqrt(lp.a * lp.a + lp.b * lp.b);

            var relativeXY = get_relativeXY(fp0x ,fp0y, fp1x , fp1y , THRE_DISTANCE); //直線の領域のx,y座標

            if(distance1 < THRE_DISTANCE){
              if(b1x < relativeXY.max_x && b1x > relativeXY.min_x && b1y < relativeXY.max_y && b1y > relativeXY.min_y){
                this.addClass('distance_check');
                self.addClass('distance_check');
              }
            }
            if(distance2 < THRE_DISTANCE){
              if(b2x < relativeXY.max_x && b2x > relativeXY.min_x && b2y < relativeXY.max_y && b2y > relativeXY.min_y){
                this.addClass('distance_check');
                self.addClass('distance_check');
              }
            }
            if(distance3 < THRE_DISTANCE){
              if(b3x < relativeXY.max_x && b3x > relativeXY.min_x && b3y < relativeXY.max_y && b3y > relativeXY.min_y){
                this.addClass('distance_check');
                self.addClass('distance_check');
              }
            }
            if(distance4 < THRE_DISTANCE){
              if(b4x < relativeXY.max_x && b4x > relativeXY.min_x && b4y < relativeXY.max_y && b4y > relativeXY.min_y){
                this.addClass('distance_check');
                self.addClass('distance_check');
              }
            }
          }
        })

        //円記号との距離を計算し、近すぎないか判定
        draw.select('.circle').each(function(i , children){
          let stroke_width = this.attr('stroke-width');
          if(this.visible() && stroke_width !== 0){
            var cx = Number(this.attr('cx')) , cy = Number(this.attr('cy')); //円の中心座標
            var cr = Number(this.attr('r')); //円の半径

            var Unit_a = lp.a/Math.sqrt(lp.a * lp.a + lp.b * lp.b); //単位方向ベクトル
            var Unit_b = lp.b/Math.sqrt(lp.a * lp.a + lp.b * lp.b);
            var b1x = cx + Unit_a * cr , b1y = cy + Unit_b * cr;

            var dif_0x = fp0x - cx , dif_0y = fp0y - cy;
            var dif_1x = fp1x - cx , dif_1y = fp1y - cy;

            var distance1 = Math.abs(lp.a * b1x + lp.b * b1y + lp.c)/Math.sqrt(lp.a * lp.a + lp.b * lp.b);
            var distance2 = Math.sqrt(dif_0x * dif_0x + dif_0y * dif_0y) - cr;
            var distance3 = Math.sqrt(dif_1x * dif_1x + dif_1y * dif_1y) - cr;

            var relativeXY = get_relativeXY(fp0x ,fp0y, fp1x , fp1y , THRE_DISTANCE); //直線の領域のx,y座標

            if(distance1 < THRE_DISTANCE){
              if(b1x < relativeXY.max_x && b1x > relativeXY.min_x && b1y < relativeXY.max_y && b1y > relativeXY.min_y){
                this.addClass('distance_check');
                self.addClass('distance_check');
              }
            }
            if(distance2 < THRE_DISTANCE){
              this.addClass('distance_check');
              self.addClass('distance_check');
            }
            if(distance3 < THRE_DISTANCE){
              this.addClass('distance_check');
              self.addClass('distance_check');
            }
          }
        })
      }
    }
  })
  //距離が近いと判定された要素の表示と色の変更
  var dis_braille_num = 0 , dis_symbol_num = 0 , dis_circle_num = 0; //距離が近い要素の数
  draw.select('.distance_check').each(function(i , children){
    if(this.hasClass('braille')) dis_braille_num++;
    if(this.hasClass('symbol')) dis_symbol_num++;
    if(this.hasClass('circle')) dis_circle_num++;
    var bbox = get_bbox(this);
    var rx = bbox.min_x , ry = bbox.min_y;
    var width = bbox.max_x - bbox.min_x , height = bbox.max_y - bbox.min_y;
    var distance_rect = draw.rect(width , height);
    distance_rect.attr({
      'x' : rx,
      'y' : ry,
      'fill' : 'none',
      'stroke' : '#DAA520',
      'stroke-width' : PS_WIDTH/2,
      'class' : 'distance_rect'
    });
  })
  /**
  alert(  "距離間が近い要素の数\n" +
          "点字："+ dis_braille_num + "\n" +
          "記号："+ dis_symbol_num + "\n" +
          "円："+ dis_circle_num + "\n"
        );
        **/
  setTimeout("reset_dcheck_element()", 5000);
}

//引数に指定した要素の4点座標を返す。pathの場合は配列＋objectで返す。
function get_p4oint(element){ //element : 対象の要素

  var four_point_array = new Array();
  if(element.hasClass('path')){
    var stroke_width = Number (element.attr('stroke-width') );
    var dpoint = element.clear().array().settle() //pathのdpoint配列を取得
    for(var j=0;j<dpoint.length-1; j++){
      var p1_x = 0 , p1_y = 0 , p2_x = 0 , p2_y = 0;
      if(dpoint[j+1][0]!=="Z"){  //次の要素がZ要素でない場合
        p1_x = Number(dpoint[j][1]) , p1_y = Number(dpoint[j][2]);
        p2_x = Number(dpoint[j+1][1]) , p2_y = Number(dpoint[j+1][2]);
      }else{  //次の要素がZ要素である場合
        p1_x = Number(dpoint[j][1]) , p1_y = Number(dpoint[j][2]);
        p2_x = Number(dpoint[0][1]) , p2_y = Number(dpoint[0][2]);
      }
      var angle = Math.atan((p2_y- p1_y)/(p2_x - p1_x))- Math.PI/2; //角度計算
      var four_point = new Object();
      four_point.x0 = stroke_width/2 * Math.cos(angle) + p1_x;
      four_point.y0 = stroke_width/2 * Math.sin(angle) + p1_y;
      four_point.x1 = stroke_width/2 * Math.cos(angle) + p2_x;
      four_point.y1 = stroke_width/2 * Math.sin(angle) + p2_y;
      four_point.x2 = -stroke_width/2 * Math.cos(angle) + p2_x;
      four_point.y2 = -stroke_width/2 * Math.sin(angle) + p2_y;
      four_point.x3 = -stroke_width/2 * Math.cos(angle) + p1_x;
      four_point.y3 = -stroke_width/2 * Math.sin(angle) + p1_y;
      four_point_array.push(four_point);
    }
  }else if(element.hasClass('braille')){
    var matrix = element.transform('matrix')
    var trans_matrix = [[matrix.a, matrix.c, matrix.e]
                      ,[matrix.b, matrix.d, matrix.f]
                      ,[0, 0, 1]];

    var corre_braille = element.attr('font-size')/4; //点字が占めるエリア領域の補正量 : ikarashi braille がデフォルトでそういう仕様になっている

    var pmin_x = Number(element.attr('x')) + corre_braille;
    var pmax_x = Number(element.attr('x')) + Number(element.bbox().width) - corre_braille;
    var pmin_y = Number(element.attr('y')) - Number(element.bbox().height);
    var pmax_y = Number(element.attr('y'));

    var position1 = [ [ pmin_x ],[ pmin_y ],[1]];
    var position2 = [ [ pmax_x ],[ pmin_y ],[1]];
    var position3 = [ [ pmin_x ],[ pmax_y ],[1]];
    var position4 = [ [ pmax_x ],[ pmax_y ],[1]];

    var trans1 = math.multiply(trans_matrix , position1);
    var trans2 = math.multiply(trans_matrix , position2);
    var trans3 = math.multiply(trans_matrix , position3);
    var trans4 = math.multiply(trans_matrix , position4);

    var four_point = new Object();
    four_point.x0 = Number(trans1[0][0]) , four_point.y0 = Number(trans1[1][0]);
    four_point.x1 = Number(trans2[0][0]) , four_point.y1 = Number(trans2[1][0]);
    four_point.x2 = Number(trans3[0][0]) , four_point.y2 = Number(trans3[1][0]);
    four_point.x3 = Number(trans4[0][0]) , four_point.y3 = Number(trans4[1][0]);
    four_point_array.push(four_point);

  }
  return four_point_array;
}

function reset_dcheck_element(){
  draw.select('.distance_check').each(function(i , children){
    this.removeClass('distance_check');
    let font_strokewidth = ($('input[name="braillefont"]:checked').val()==='IkarashiBraille_font') ? String(PS_WIDTH * 0.25) : '';
    let font_strokecolor = ($('input[name="braillefont"]:checked').val()==='IkarashiBraille_font') ? '#000000' : 'none';
    if(this.hasClass('braille')){
      this.attr({
        'stroke': font_strokecolor,
        'stroke-width': font_strokewidth
      })
    }else{
      this.attr({'stroke': '#000000' });
    }
  })
  draw.select('.distance_rect').each(function(i , children){
    this.remove();
  })
}
