// Generated by CoffeeScript 1.7.1
(function() {
  $(function() {
    var add_list, all_word_num, ans_form, btn_answer, btn_end, btn_start, btn_tweet, data_start_id, dtime, game_end, game_flag, game_id, game_mode, game_name, game_start, game_start_open, generate_tag_check_span, get_forms, input_game_name, input_tag_form, my_disp, my_disp_down, name_check, post_result, process_count_span, replay, solve_count, start_time, stc, tag_check_box, td_boxs, time_box, timer_btn, timer_id, timer_input, timer_input_val, timer_mode, to_ans_kana, to_double0, to_time_str, to_time_str_r, word_boxs, word_unit, wordbox_change, wordbox_clear;
    td_boxs = $('table.table-words td').not('.emp');
    ans_form = $('#answer-form');
    process_count_span = $('span#process_count');
    btn_end = $('#submit-end');
    btn_start = $('#submit-start');
    btn_tweet = $('#submit-tweet');
    btn_answer = $('#submit-answer');
    time_box = $('#time-box');
    word_boxs = $('.wordbox');
    all_word_num = td_boxs.size();
    game_id = $('#game-id').val();
    game_name = $('#game-name').val();
    game_mode = $('#game-mode').val();
    word_unit = $('#word-unit').val();
    timer_btn = $('#timer-toggle-btn');
    timer_input = $('#timer-input');
    input_tag_form = $('#input_tags');
    tag_check_box = $('#tag-check');
    timer_input_val = 0;
    timer_mode = 0;
    solve_count = 0;
    game_flag = 0;
    dtime = 0;
    start_time = null;
    timer_id = null;
    data_start_id = [];
    stc = $.SuperTextConverter();
    btn_end.hide();
    btn_answer.hide();
    btn_tweet.hide();
    input_game_name = $('#input_game_name');
    to_ans_kana = function(str) {
      str = str.replace(/[-ー]/g, '__h').replace(/\./g, '__d').replace(/\+/g, '__p').replace(/#/g, '__s').replace(/[・\s]/, '');
      return stc.toHankaku(stc.toHiragana(stc.killHankakuKatakana(str)), {
        convert: {
          punctuation: false
        }
      }).toLowerCase();
    };
    replay = function() {
      var ans, td, word, word_k;
      word = ans_form.val();
      if (game_flag !== 1 || !word) {
        return;
      }
      word_k = to_ans_kana(word);
      console.log(word_k);
      td = $("td[ansc=" + word_k + "]");
      ans = td.attr('ans');
      if (td.size() < 1 || td.hasClass("ok")) {
        return;
      }
      td.html(ans);
      td.addClass('ok');
      ans_form.val('');
      data_start_id.push(td.attr('nid'));
      solve_count++;
      process_count_span.html(solve_count);
      if (solve_count === all_word_num) {
        return game_end();
      }
    };
    game_end = function() {
      var ng_ids;
      game_flag = 0;
      clearInterval(timer_id);
      btn_end.hide();
      btn_answer.hide();
      btn_start.show();
      btn_tweet.show();
      timer_btn.removeClass("disabled");
      ng_ids = [];
      td_boxs.not('.ok').each(function() {
        $(this).html($(this).attr('ans'));
        $(this).addClass('ng');
        return ng_ids.push($(this).attr('nid'));
      });
      if (all_word_num < 5 || data_start_id.length >= 1) {
        return post_result(data_start_id, ng_ids);
      }
    };
    game_start = function() {
      game_flag = 2;
      start_time = new Date().getTime();
      btn_start.hide();
      btn_tweet.hide();
      btn_answer.show();
      btn_end.show();
      dtime = 0;
      solve_count = 0;
      data_start_id = [];
      btn_answer.attr('disabled', '');
      btn_end.attr('disabled', '');
      process_count_span.html(0);
      time_box.css('color', 'red');
      timer_btn.addClass("disabled");
      td_boxs.each(function() {
        if (game_mode === 'normal') {
          $(this).html("");
        }
        $(this).removeClass('ok');
        return $(this).removeClass('ng');
      });
      return timer_id = setInterval(function() {
        return my_disp_down();
      }, 1);
    };
    game_start_open = function() {
      game_flag = 1;
      btn_answer.removeAttr('disabled');
      btn_end.removeAttr('disabled');
      clearInterval(timer_id);
      start_time = new Date().getTime();
      if (timer_mode === 1) {
        timer_input_val = timer_input.val();
        start_time += 60 * 1000 * timer_input_val;
      }
      time_box.css('color', 'black');
      return timer_id = setInterval(function() {
        return my_disp();
      }, 1);
    };
    to_double0 = function(n) {
      if (n < 10) {
        return '0' + n;
      }
      return n;
    };
    my_disp = function() {
      var myH, myM, myMS, myS;
      if (timer_mode === 1) {
        dtime = start_time - new Date().getTime();
        if (dtime < 0) {
          game_end();
          dtime = 0;
        }
      } else {
        dtime = new Date().getTime() - start_time;
      }
      myH = Math.floor(dtime / (60 * 60 * 1000));
      dtime = dtime - (myH * 60 * 60 * 1000);
      myM = Math.floor(dtime / (60 * 1000));
      dtime = dtime - (myM * 60 * 1000);
      myS = Math.floor(dtime / 1000);
      myMS = Math.floor(dtime / 10 % 100);
      return time_box.html(to_double0(myH) + ":" + to_double0(myM) + ":" + to_double0(myS) + "." + to_double0(myMS));
    };
    my_disp_down = function() {
      var myS;
      dtime = 3000 - (new Date().getTime() - start_time);
      if (dtime <= 0) {
        game_start_open();
        return;
      }
      myS = Math.floor(dtime / 1000) + 1;
      return time_box.html("--:--:" + to_double0(myS) + ".--");
    };
    btn_start.click(function() {
      ans_form.focus();
      return game_start();
    });
    btn_end.click(function() {
      return game_end();
    });
    post_result = function(start_ids, ng_ids) {
      var data;
      start_ids = start_ids.filter(function(e) {
        return !!e;
      });
      ng_ids = ng_ids.filter(function(e) {
        return !!e;
      });
      data = {
        start_ids: start_ids.join(","),
        ng_ids: ng_ids.join(",")
      };
      return $.ajax({
        type: "POST",
        url: "../game/result/" + game_id,
        data: data,
        success: function(res) {
          return console.log(res);
        },
        error: function() {
          return console.log('result post error');
        }
      });
    };
    ans_form.on("keypress", function(e) {
      if (e.which === 13) {
        return replay();
      }
    });
    btn_answer.click(function() {
      replay();
      return ans_form.focus();
    });
    add_list = function() {
      var add_text, add_words, i, reg_text, _i, _ref;
      add_text = $('#input_add').val();
      reg_text = '[';
      if ($("#checkbox-split-comma").prop('checked')) {
        reg_text += ",";
      }
      if ($("#checkbox-split-return").prop('checked')) {
        reg_text += "\n";
      }
      if ($("#checkbox-split-space").prop('checked')) {
        reg_text += " ";
      }
      if ($("#checkbox-split-tab").prop('checked')) {
        reg_text += "\t";
      }
      reg_text += ']';
      add_words = add_text.split(new RegExp(reg_text));
      for (i = _i = 0, _ref = add_words.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        add_words[i] = add_words[i].replace(/[,\n\t ]/g, '');
      }
      add_words = add_words.filter(function(e) {
        return !!e;
      });
      $.each(add_words, function(i, v) {
        return add_words[i] = v.substr(0, 20);
      });
      add_words = $.unique(add_words);
      word_boxs.each(function() {
        if (!$(this).val()) {
          $(this).val(add_words.shift());
          if (add_words.length === 0) {
            return false;
          }
        }
      });
      $('#input_add').val("");
      return wordbox_change();
    };
    $('#submit-add').click(add_list);
    $('#input_add').on("keypress", function(e) {
      if (e.which === 13) {
        add_list();
        return false;
      }
    });
    get_forms = function() {
      var data, ds, game_description, game_tags, wordlist, words_text, words_unit;
      wordlist = [];
      word_boxs.each(function() {
        var v;
        v = $.trim($(this).val());
        if (v) {
          return wordlist.push(v);
        }
      });
      words_text = wordlist.join(',');
      game_name = $.trim(input_game_name.val());
      words_unit = $.trim($('#input_words_unit').val());
      if (ds = $('#input_description').val()) {
        game_description = $.trim(ds);
      } else {
        game_description = "";
      }
      game_tags = $.trim(input_tag_form.val());
      if (words_text !== '' && (game_name != null) && (words_unit != null)) {
        return data = {
          game_name: game_name,
          words_unit: words_unit,
          game_description: game_description,
          game_tags: game_tags,
          words_list_text: words_text
        };
      }
      return false;
    };
    wordbox_change = function() {
      var c;
      c = 0;
      word_boxs.each(function() {
        if ($(this).val() !== "") {
          return c++;
        }
      });
      return $('#num').html(('   ' + c).substr(-3).replace(' ', '&nbsp;'));
    };
    word_boxs.change(function() {
      return wordbox_change();
    });
    word_boxs.hover(function() {
      return $(this).next('.delete-btn').show();
    }, function() {
      return $(this).next('.delete-btn').hide();
    });
    $('.delete-btn').hover(function() {
      return $(this).show();
    }, function() {
      return $(this).hide();
    });
    $('.delete-btn').click(function() {
      $(this).prev('input').val('');
      return false;
    });
    wordbox_clear = function() {
      return word_boxs.each(function() {
        return $(this).val("");
      });
    };
    $('#submit-clear').click(wordbox_clear);
    name_check = function() {
      var data;
      data = {
        name: input_game_name.val()
      };
      $('#check-name').html('check');
      $('#check-name').parent().parent().removeClass('has-error');
      return $.ajax({
        type: "POST",
        url: "make/check",
        data: data,
        success: function(res) {
          if (res === "s") {
            $('#check-name').html('使うことのできるタイトルです');
            return $('#check-name').css('color', 'green');
          } else {
            $('#check-name').html('既に使われているタイトルです');
            $('#check-name').parent().parent().addClass('has-error');
            return $('#check-name').css('color', 'red');
          }
        },
        error: function() {
          return console.log('check error');
        }
      });
    };
    input_game_name.change(function() {
      return name_check();
    });
    $('#check-btn').click(function() {
      var gn, ok;
      ok = true;
      if (gn = $.trim(input_game_name.val())) {
        gn;
      } else {
        ok = false;
      }
      $('#input_words_unit').val();
      return $('#input_descripiton').val();
    });
    $('#submit-btn').click(function() {
      var data;
      if (!(data = get_forms())) {
        console.log('form no comp');
        return false;
      }
      return $.ajax({
        type: "POST",
        url: "make/post",
        data: data,
        success: function(res) {
          var res_code, res_text, ress;
          console.log(res);
          ress = res.split(':');
          res_code = ress[0];
          res_text = ress[1];
          switch (res_code) {
            case 'e':
              return console.log("ゲーム名が既に使われています");
            case 's':
              return location.href = 'g/' + res_text;
          }
        },
        error: function() {
          return console.log('connect error');
        }
      });
    });
    word_boxs.change(function() {
      return wordbox_change;
    });
    btn_tweet.click(function() {
      var hashtags, share_url, text, time, url;
      hashtags = '言えるかな';
      if (timer_mode === 1) {
        time = to_time_str_r(time_box.html());
      } else {
        time = to_time_str(time_box.html());
      }
      if (game_mode !== 'typing') {
        if (all_word_num === solve_count) {
          text = "" + game_name + "を" + solve_count + word_unit + "全て言うことが出来ました！[" + time + "]";
        } else {
          text = "" + game_name + "を" + all_word_num + word_unit + "中" + solve_count + word_unit + "言えました[" + time + "]";
        }
        if (game_mode !== 'normal') {
          text += "<" + game_mode + ">";
        }
      } else {
        text = "" + game_name + solve_count + word_unit + "を[" + time + "]でタイプしました";
      }
      share_url = location.href;
      url = "https://twitter.com/intent/tweet?hashtags=" + hashtags + "&text=" + text + "&url=" + share_url;
      return window.open(url);
    });
    $('#btn-please').click(function() {
      var hashtags, text, url;
      hashtags = '言えるかな作って';
      text = "";
      url = "https://twitter.com/intent/tweet?hashtags=" + hashtags + "&text=" + text;
      return window.open(url);
    });
    to_time_str_r = function(time) {
      var str, time_h, time_m, time_s, ts, ts2;
      ts = time.split(':');
      ts2 = ts[2].split('.');
      dtime = ((timer_input_val - (ts[0] * 60 + ts[1])) * 60 - ts2[0]) * 1000 - ts2[1] * 10;
      time_h = Math.floor(dtime / (60 * 60 * 1000));
      dtime = dtime - (time_h * 60 * 60 * 1000);
      time_m = Math.floor(dtime / (60 * 1000));
      dtime = dtime - (time_m * 60 * 1000);
      time_s = Math.floor(dtime / 1000);
      str = (time_h ? time_h + '時間' : '') + "" + (time_m ? time_m + '分' : '') + "" + time_s + '秒';
      return str;
    };
    to_time_str = function(time) {
      var time_h, time_m, time_s, ts, ts2;
      ts = time.split(':');
      time_h = ts[0] * 1;
      time_m = ts[1] * 1;
      ts2 = ts[2].split('.');
      time_s = ts2[0] * 1;
      return (time_h ? time_h + '時間' : '') + "" + (time_m ? time_m + '分' : '') + "" + time_s + '秒';
    };
    $('#update-btn').click(function() {
      var data;
      data = get_forms();
      $('#words-text-box').val(data.words_list_text);
      return $('form').submit();
    });
    timer_btn.click(function() {
      if (timer_mode === 0) {
        timer_input.removeAttr('disabled');
        $('.timer-set').removeAttr('disabled');
        return timer_mode = 1;
      } else {
        timer_input.attr('disabled', "");
        $('.timer-set').attr('disabled', "");
        return timer_mode = 0;
      }
    });
    input_tag_form.change(function() {
      var data, v;
      tag_check_box.html('---');
      if ((v = input_tag_form.val()) === "") {
        return;
      }
      data = {
        tags_text: v
      };
      return $.ajax({
        type: "POST",
        url: "./make/tag_check/",
        data: data,
        success: function(res) {
          var $tag, i, nums, tags, _i, _ref, _results;
          console.log(res);
          nums = res.split(',');
          tags = v.split(',');
          tag_check_box.html('');
          _results = [];
          for (i = _i = 0, _ref = nums.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
            $tag = generate_tag_check_span(tags[i], nums[i]);
            _results.push(tag_check_box.append($tag));
          }
          return _results;
        },
        error: function() {
          return console.log('result post error');
        }
      });
    });
    return generate_tag_check_span = function(tag_text, num) {
      var $badge;
      $badge = $('<span/>').addClass('badge').html(num);
      return $('<span/>').addClass('tag').html(tag_text).append($badge);
    };
  });

}).call(this);
