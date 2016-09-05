/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	__webpack_require__(1);
	
	var Game = __webpack_require__(4);
	var Gallery = __webpack_require__(5);
	
	var reviewForm = __webpack_require__(6);
	
	
	var game = new Game(document.querySelector('.demo'));
	
	game.initializeLevelAndStart();
	game.setGameStatus(Game.Verdict.INTRO);
	
	var formOpenButton = document.querySelector('.reviews-controls-new');
	
	/** @param {MouseEvent} evt */
	formOpenButton.onclick = function(evt) {
	  evt.preventDefault();
	
	  reviewForm.open(function() {
	    game.setGameStatus(Game.Verdict.PAUSE);
	    game.setDeactivated(true);
	  });
	};
	
	reviewForm.onClose = function() {
	  game.setDeactivated(false);
	};
	
	
	/**
	  * Галерея скриншотов
	  */
	
	var galleryImages = document.querySelectorAll('.photogallery .photogallery-image img');
	var galleryImagesSrc = [];
	
	for(var i = 0; i < galleryImages.length; i++) {
	  galleryImagesSrc.push(galleryImages[i].src);
	}
	
	var gallery = new Gallery(galleryImagesSrc);
	
	var galleryImageRefs = document.querySelectorAll('.photogallery .photogallery-image');
	
	for(var j = 0; j < galleryImageRefs.length; j++) {
	
	  var galleryImageOnClickHandler = function handler() {
	    gallery.show(handler.imageIndex);
	  };
	
	  galleryImageOnClickHandler.imageIndex = j;
	
	  galleryImageRefs[j].onclick = galleryImageOnClickHandler;
	}


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Review = __webpack_require__(2);
	
	var requestJSONP = __webpack_require__(3);
	
	
	var reviewsFilter = document.querySelector('.reviews-filter');
	var reviewsList = document.querySelector('.reviews-list');
	var reviewsArr = [];
	
	var reviewsURL = 'http://localhost:1506/api/reviews';
	
	requestJSONP(reviewsURL, function(reviews) {
	
	  reviewsFilter.classList.add('invisible');
	
	  reviews.forEach(function(item) {
	
	    var review = new Review(item);
	
	    reviewsArr.push(review);
	
	    reviewsList.appendChild(review.element);
	  });
	
	  reviewsFilter.classList.remove('invisible');
	});


/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';
	
	var IMAGE_LOAD_TIMEOUT = 10000;
	var IMAGE_AUTHOR_WIDHT = 124;
	var IMAGE_AUTHOR_HEIGHT = 124;
	var IMAGE_RAITING_WIDTH = 40;
	
	var reviewTemplate = document.querySelector('#review-template');
	
	var reviewToClone =
	  reviewTemplate.content.querySelector('.review') || reviewTemplate.querySelector('.review');
	
	
	function getReviewElement(data) {
	
	  var reviewItem = reviewToClone.cloneNode(true);
	
	  var reviewAuthor = reviewItem.querySelector('.review-author');
	  var reviewRating = reviewItem.querySelector('.review-rating');
	  var reviewText = reviewItem.querySelector('.review-text');
	
	  var authorPicture = new Image(IMAGE_AUTHOR_WIDHT, IMAGE_AUTHOR_HEIGHT);
	
	  var pictureLoadTimeout;
	
	  authorPicture.onload = function(evt) {
	    clearTimeout(pictureLoadTimeout);
	    reviewAuthor.width = IMAGE_AUTHOR_WIDHT;
	    reviewAuthor.height = IMAGE_AUTHOR_HEIGHT;
	    reviewAuthor.src = evt.target.src;
	    reviewAuthor.alt = data.author.name;
	    reviewAuthor.title = data.author.name;
	  };
	
	  authorPicture.onerror = function() {
	    reviewItem.classList.add('review-load-failure');
	  };
	
	  pictureLoadTimeout = setTimeout(function() {
	    authorPicture.src = '';
	    reviewItem.classList.add('review-load-failure');
	  }, IMAGE_LOAD_TIMEOUT);
	
	  authorPicture.src = data.author.picture;
	
	  reviewRating.style.width = (IMAGE_RAITING_WIDTH * data.rating) + 'px';
	
	  reviewText.textContent = data.description;
	
	  return reviewItem;
	}
	
	var Review = function(data) {
	  this.data = data;
	  this.element = getReviewElement(this.data);
	  this.quizAnswers = this.element.querySelectorAll('.review-quiz-answer');
	
	  var self = this;
	
	  this.onReviewQuizAnswerClick = function(evt) {
	
	    for(var i = 0; i < self.quizAnswers.length; i++) {
	      self.quizAnswers[i].classList.remove('review-quiz-answer-active');
	    }
	
	    evt.target.classList.add('review-quiz-answer-active');
	  };
	
	  for(var i = 0; i < this.quizAnswers.length; i++) {
	    this.quizAnswers[i].onclick = this.onReviewQuizAnswerClick;
	  }
	};
	
	Review.prototype.remove = function() {
	  for(var i = 0; i < this.quizAnswers.length; i++) {
	    this.quizAnswers[i].onclick = null;
	  }
	
	  this.element.parentNode.removeChild(this.element);
	};
	
	module.exports = Review;


/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';
	
	var CALLBACK_FUNCTION_NAME = 'JSONPCallback';
	
	module.exports = function(url, callback) {
	
	  window[CALLBACK_FUNCTION_NAME] = function(data) {
	
	    if (typeof callback === 'function') {
	      callback(data);
	    }
	  };
	
	  var scriptTag = document.createElement('script');
	
	  scriptTag.src = url + '?callback=' + CALLBACK_FUNCTION_NAME;
	
	  document.body.appendChild(scriptTag);
	};


/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';
	
	
	/**
	 * @const
	 * @type {number}
	 */
	var HEIGHT = 300;
	
	/**
	 * @const
	 * @type {number}
	 */
	var WIDTH = 700;
	
	/**
	 * ID уровней.
	 * @enum {number}
	 */
	var Level = {
	  INTRO: 0,
	  MOVE_LEFT: 1,
	  MOVE_RIGHT: 2,
	  LEVITATE: 3,
	  HIT_THE_MARK: 4
	};
	
	/**
	 * Порядок прохождения уровней.
	 * @type {Array.<Level>}
	 */
	var LevelSequence = [
	  Level.INTRO
	];
	
	/**
	 * Начальный уровень.
	 * @type {Level}
	 */
	var INITIAL_LEVEL = LevelSequence[0];
	
	/**
	 * Допустимые виды объектов на карте.
	 * @enum {number}
	 */
	var ObjectType = {
	  ME: 0,
	  FIREBALL: 1
	};
	
	/**
	 * Допустимые состояния объектов.
	 * @enum {number}
	 */
	var ObjectState = {
	  OK: 0,
	  DISPOSED: 1
	};
	
	/**
	 * Коды направлений.
	 * @enum {number}
	 */
	var Direction = {
	  NULL: 0,
	  LEFT: 1,
	  RIGHT: 2,
	  UP: 4,
	  DOWN: 8
	};
	
	/**
	 * Правила перерисовки объектов в зависимости от состояния игры.
	 * @type {Object.<ObjectType, function(Object, Object, number): Object>}
	 */
	var ObjectsBehaviour = {};
	
	/**
	 * Обновление движения мага. Движение мага зависит от нажатых в данный момент
	 * стрелок. Маг может двигаться одновременно по горизонтали и по вертикали.
	 * На движение мага влияет его пересечение с препятствиями.
	 * @param {Object} object
	 * @param {Object} state
	 * @param {number} timeframe
	 */
	ObjectsBehaviour[ObjectType.ME] = function(object, state, timeframe) {
	  // Пока зажата стрелка вверх, маг сначала поднимается, а потом левитирует
	  // в воздухе на определенной высоте.
	  // NB! Сложность заключается в том, что поведение описано в координатах
	  // канваса, а не координатах, относительно нижней границы игры.
	  if (state.keysPressed.UP && object.y > 0) {
	    object.direction = object.direction & ~Direction.DOWN;
	    object.direction = object.direction | Direction.UP;
	    object.y -= object.speed * timeframe * 2;
	
	    if (object.y < 0) {
	      object.y = 0;
	    }
	  }
	
	  // Если стрелка вверх не зажата, а маг находится в воздухе, он плавно
	  // опускается на землю.
	  if (!state.keysPressed.UP) {
	    if (object.y < HEIGHT - object.height) {
	      object.direction = object.direction & ~Direction.UP;
	      object.direction = object.direction | Direction.DOWN;
	      object.y += object.speed * timeframe / 3;
	    } else {
	      object.Direction = object.direction & ~Direction.DOWN;
	    }
	  }
	
	  // Если зажата стрелка влево, маг перемещается влево.
	  if (state.keysPressed.LEFT) {
	    object.direction = object.direction & ~Direction.RIGHT;
	    object.direction = object.direction | Direction.LEFT;
	    object.x -= object.speed * timeframe;
	  }
	
	  // Если зажата стрелка вправо, маг перемещается вправо.
	  if (state.keysPressed.RIGHT) {
	    object.direction = object.direction & ~Direction.LEFT;
	    object.direction = object.direction | Direction.RIGHT;
	    object.x += object.speed * timeframe;
	  }
	
	  // Ограничения по перемещению по полю. Маг не может выйти за пределы поля.
	  if (object.y < 0) {
	    object.y = 0;
	    object.Direction = object.direction & ~Direction.DOWN;
	    object.Direction = object.direction & ~Direction.UP;
	  }
	
	  if (object.y > HEIGHT - object.height) {
	    object.y = HEIGHT - object.height;
	    object.Direction = object.direction & ~Direction.DOWN;
	    object.Direction = object.direction & ~Direction.UP;
	  }
	
	  if (object.x < 0) {
	    object.x = 0;
	  }
	
	  if (object.x > WIDTH - object.width) {
	    object.x = WIDTH - object.width;
	  }
	};
	
	/**
	 * Обновление движения файрбола. Файрбол выпускается в определенном направлении
	 * и после этого неуправляемо движется по прямой в заданном направлении. Если
	 * он пролетает весь экран насквозь, он исчезает.
	 * @param {Object} object
	 * @param {Object} state
	 * @param {number} timeframe
	 */
	ObjectsBehaviour[ObjectType.FIREBALL] = function(object, state, timeframe) {
	  if (object.direction & Direction.LEFT) {
	    object.x -= object.speed * timeframe;
	  }
	
	  if (object.direction & Direction.RIGHT) {
	    object.x += object.speed * timeframe;
	  }
	
	  if (object.x < 0 || object.x > WIDTH) {
	    object.state = ObjectState.DISPOSED;
	  }
	};
	
	/**
	 * ID возможных ответов функций, проверяющих успех прохождения уровня.
	 * CONTINUE говорит о том, что раунд не закончен и игру нужно продолжать,
	 * WIN о том, что раунд выигран, FAIL — о поражении. PAUSE о том, что игру
	 * нужно прервать.
	 * @enum {number}
	 */
	var Verdict = {
	  CONTINUE: 0,
	  WIN: 1,
	  FAIL: 2,
	  PAUSE: 3,
	  INTRO: 4
	};
	
	/**
	 * Правила завершения уровня. Ключами служат ID уровней, значениями функции
	 * принимающие на вход состояние уровня и возвращающие true, если раунд
	 * можно завершать или false если нет.
	 * @type {Object.<Level, function(Object):boolean>}
	 */
	var LevelsRules = {};
	
	/**
	 * Уровень считается пройденным, если был выпущен файлболл и он улетел
	 * за экран.
	 * @param {Object} state
	 * @return {Verdict}
	 */
	LevelsRules[Level.INTRO] = function(state) {
	  var fireballs = state.garbage.filter(function(object) {
	    return object.type === ObjectType.FIREBALL;
	  });
	
	  return fireballs.length ? Verdict.WIN : Verdict.CONTINUE;
	};
	
	/**
	 * Начальные условия для уровней.
	 * @enum {Object.<Level, function>}
	 */
	var LevelsInitialize = {};
	
	/**
	 * Первый уровень.
	 * @param {Object} state
	 * @return {Object}
	 */
	LevelsInitialize[Level.INTRO] = function(state) {
	  state.objects.push(
	    // Установка персонажа в начальное положение. Он стоит в крайнем левом
	    // углу экрана, глядя вправо. Скорость перемещения персонажа на этом
	    // уровне равна 2px за кадр.
	    {
	      direction: Direction.RIGHT,
	      height: 84,
	      speed: 2,
	      sprite: 'img/wizard.gif',
	      spriteReversed: 'img/wizard-reversed.gif',
	      state: ObjectState.OK,
	      type: ObjectType.ME,
	      width: 61,
	      x: WIDTH / 3,
	      y: HEIGHT - 100
	    }
	  );
	
	  return state;
	};
	
	/**
	 * Конструктор объекта Game. Создает canvas, добавляет обработчики событий
	 * и показывает приветственный экран.
	 * @param {Element} container
	 * @constructor
	 */
	var Game = function(container) {
	  this.container = container;
	  this.canvas = document.createElement('canvas');
	  this.canvas.width = container.clientWidth;
	  this.canvas.height = container.clientHeight;
	  this.container.appendChild(this.canvas);
	
	  this.ctx = this.canvas.getContext('2d');
	
	  this._onKeyDown = this._onKeyDown.bind(this);
	  this._onKeyUp = this._onKeyUp.bind(this);
	  this._pauseListener = this._pauseListener.bind(this);
	
	  this.setDeactivated(false);
	};
	
	Game.prototype = {
	  /**
	   * Текущий уровень игры.
	   * @type {Level}
	   */
	  level: INITIAL_LEVEL,
	
	  /** @param {boolean} deactivated */
	  setDeactivated: function(deactivated) {
	    if (this._deactivated === deactivated) {
	      return;
	    }
	
	    this._deactivated = deactivated;
	
	    if (deactivated) {
	      this._removeGameListeners();
	    } else {
	      this._initializeGameListeners();
	    }
	  },
	
	  /**
	   * Состояние игры. Описывает местоположение всех объектов на игровой карте
	   * и время проведенное на уровне и в игре.
	   * @return {Object}
	   */
	  getInitialState: function() {
	    return {
	      // Статус игры. Если CONTINUE, то игра продолжается.
	      currentStatus: Verdict.CONTINUE,
	
	      // Объекты, удаленные на последнем кадре.
	      garbage: [],
	
	      // Время с момента отрисовки предыдущего кадра.
	      lastUpdated: null,
	
	      // Состояние нажатых клавиш.
	      keysPressed: {
	        ESC: false,
	        LEFT: false,
	        RIGHT: false,
	        SPACE: false,
	        UP: false
	      },
	
	      // Время начала прохождения уровня.
	      levelStartTime: null,
	
	      // Все объекты на карте.
	      objects: [],
	
	      // Время начала прохождения игры.
	      startTime: null
	    };
	  },
	
	  /**
	   * Начальные проверки и запуск текущего уровня.
	   * @param {Level=} level
	   * @param {boolean=} restart
	   */
	  initializeLevelAndStart: function(level, restart) {
	    level = typeof level === 'undefined' ? this.level : level;
	    restart = typeof restart === 'undefined' ? true : restart;
	
	    if (restart || !this.state) {
	      // При перезапуске уровня, происходит полная перезапись состояния
	      // игры из изначального состояния.
	      this.state = this.getInitialState();
	      this.state = LevelsInitialize[this.level](this.state);
	    } else {
	      // При продолжении уровня состояние сохраняется, кроме записи о том,
	      // что состояние уровня изменилось с паузы на продолжение игры.
	      this.state.currentStatus = Verdict.CONTINUE;
	    }
	
	    // Запись времени начала игры и времени начала уровня.
	    this.state.levelStartTime = Date.now();
	    if (!this.state.startTime) {
	      this.state.startTime = this.state.levelStartTime;
	    }
	
	    this._preloadImagesForLevel(function() {
	      // Предварительная отрисовка игрового экрана.
	      this.render();
	
	      // Установка обработчиков событий.
	      this._initializeGameListeners();
	
	      // Запуск игрового цикла.
	      this.update();
	    }.bind(this));
	  },
	
	  /**
	   * Временная остановка игры.
	   * @param {Verdict=} verdict
	   */
	  pauseLevel: function(verdict) {
	    if (verdict) {
	      this.state.currentStatus = verdict;
	    }
	
	    this.state.keysPressed.ESC = false;
	    this.state.lastUpdated = null;
	
	    this._removeGameListeners();
	    window.addEventListener('keydown', this._pauseListener);
	
	    this._drawPauseScreen();
	  },
	
	  /**
	   * Обработчик событий клавиатуры во время паузы.
	   * @param {KeyboardsEvent} evt
	   * @private
	   * @private
	   */
	  _pauseListener: function(evt) {
	    if (evt.keyCode === 32 && !this._deactivated) {
	      evt.preventDefault();
	      var needToRestartTheGame = this.state.currentStatus === Verdict.WIN ||
	        this.state.currentStatus === Verdict.FAIL;
	      this.initializeLevelAndStart(this.level, needToRestartTheGame);
	
	      window.removeEventListener('keydown', this._pauseListener);
	    }
	  },
	
	  /**
	   * Отрисовываем всплывающие сообщение
	   */
	  _drawPopupMessage: function(x1, y1, width, height, radius, fillColor) {
	
	    radius = (width < 2 * radius) ? width / 2 : radius;
	    radius = (height < 2 * radius) ? height / 2 : radius;
	
	    var x2 = x1 + width;
	    var y2 = y1 + height;
	
	    this.ctx.beginPath();
	    this.ctx.moveTo(x1 + radius, y1);
	    this.ctx.arcTo(x2, y1, x2, y2, radius);
	    this.ctx.arcTo(x2, y2, x1, y2, radius);
	    this.ctx.lineTo(x1 + radius, y2);
	    this.ctx.lineTo(x1, y2 + radius);
	    this.ctx.arcTo(x1, y1, x2, y1, radius);
	    this.ctx.closePath();
	
	    if (fillColor) {
	      this.ctx.fillStyle = fillColor;
	      this.ctx.fill();
	    }
	  },
	
	  /**
	   * Разбить сообщение на строки, не разравая слова и учитывая \n
	   */
	  _toLines: function(message, maxLineLength) {
	
	    var lines = [];
	
	    var brokenLines = message.split('\n');
	
	    for (var i = 0; i < brokenLines.length; i++) {
	      var brLine = brokenLines[i];
	
	      if (brLine.length <= maxLineLength) {
	        lines.push(brLine);
	        continue;
	      }
	
	      var bgnIndex = 0;
	      var endIndex = maxLineLength;
	
	      while (bgnIndex < brLine.length) {
	        var cIndex = brLine.lastIndexOf(' ', endIndex);
	
	        endIndex = (cIndex < 0 || cIndex < bgnIndex) ?
	          bgnIndex + maxLineLength : cIndex;
	
	        lines.push(brLine.slice(bgnIndex, endIndex));
	
	        bgnIndex = (cIndex < 0 || cIndex < bgnIndex) ?
	          endIndex : endIndex + 1;
	
	        endIndex += maxLineLength;
	      }
	    }
	    return lines;
	  },
	
	  /**
	   * Вычислим ширину тектовой области
	   */
	  _mesureTextAreaWidth: function(lines) {
	
	    var maxLineWidth = 0;
	
	    for (var i = 0; i < lines.length; i++) {
	
	      var lineWidth = (this.ctx.measureText(lines[i])).width;
	
	      maxLineWidth = (maxLineWidth > lineWidth) ? maxLineWidth : lineWidth;
	    }
	    return maxLineWidth;
	  },
	
	  /**
	   * Вывести высплывающее сообщение
	   */
	  _printPopupMessage: function(x, y, message, maxLineLength) {
	
	    var SHADOW_OFFSET = 10;
	    var PADDING = 15;
	
	    var MAX_LINE_LENGTH = 35;
	    var TEXT_FONT = '16px PT Mono';
	    var LINE_HEIGHT = 20;
	
	    // Разобьём сообщение на строки и узнаем ширину и высоту сообщения
	    var lines = this._toLines(message, (maxLineLength) ? maxLineLength : MAX_LINE_LENGTH);
	
	    this.ctx.font = TEXT_FONT;
	
	    var popWidth = this._mesureTextAreaWidth(lines) + PADDING * 2;
	    var popHeight = lines.length * LINE_HEIGHT + PADDING * 2;
	
	    // Выведем окно сообщения с тенью
	    this._drawPopupMessage(x + SHADOW_OFFSET, y + SHADOW_OFFSET,
	      popWidth, popHeight, 15, 'rgba(0, 0, 0, 0.7)');
	
	    this._drawPopupMessage(x, y, popWidth, popHeight, 15, '#FFFFFF');
	
	    // Выведем текст сообщения
	    this.ctx.fillStyle = '#000000';
	    this.ctx.textBaseline = 'hanging';
	
	    var xText = x + PADDING;
	    var yText = y + PADDING;
	
	    for (var i = 0; i < lines.length; i++) {
	
	      this.ctx.fillText(lines[i], xText, yText);
	
	      yText += LINE_HEIGHT;
	    }
	  },
	
	  /**
	   * Отрисовка экрана паузы.
	   */
	  _drawPauseScreen: function() {
	
	    switch (this.state.currentStatus) {
	      case Verdict.WIN:
	        this._printPopupMessage(300, 25,
	          'Поздравляем!\nВы выиграли! Весть о Вашей победе разнесли по всем семи королевствам!');
	        // console.log('you have won!');
	        break;
	      case Verdict.FAIL:
	        this._printPopupMessage(300, 25,
	          'Неудача!\nНе отчаиваетесь, всегда можно попробовать еще раз! Just do it!');
	        // console.log('you have failed!');
	        break;
	      case Verdict.PAUSE:
	        this._printPopupMessage(300, 25,
	          'Пауза!\nОтдышитесь, мы никуда не торопимся!');
	        // console.log('game is on pause!');
	        break;
	      case Verdict.INTRO:
	        this._printPopupMessage(300, 25,
	          'Привет!\nВы готовы к приключениям? Для того чтобы начать игру нажмите клавишу Пробел!');
	        // console.log('welcome to the game! Press Space to start');
	        break;
	    }
	  },
	
	  /**
	   * Предзагрузка необходимых изображений для уровня.
	   * @param {function} callback
	   * @private
	   */
	  _preloadImagesForLevel: function(callback) {
	    if (typeof this._imagesArePreloaded === 'undefined') {
	      this._imagesArePreloaded = [];
	    }
	
	    if (this._imagesArePreloaded[this.level]) {
	      callback();
	      return;
	    }
	
	    var levelImages = [];
	    this.state.objects.forEach(function(object) {
	      levelImages.push(object.sprite);
	
	      if (object.spriteReversed) {
	        levelImages.push(object.spriteReversed);
	      }
	    });
	
	    var i = levelImages.length;
	    var imagesToGo = levelImages.length;
	
	    while (i-- > 0) {
	      var image = new Image();
	      image.src = levelImages[i];
	      image.onload = function() {
	        if (--imagesToGo === 0) {
	          this._imagesArePreloaded[this.level] = true;
	          callback();
	        }
	      }.bind(this);
	    }
	  },
	
	  /**
	   * Обновление статуса объектов на экране. Добавляет объекты, которые должны
	   * появиться, выполняет проверку поведения всех объектов и удаляет те, которые
	   * должны исчезнуть.
	   * @param {number} delta Время, прошеднее с отрисовки прошлого кадра.
	   */
	  updateObjects: function(delta) {
	    // Персонаж.
	    var me = this.state.objects.filter(function(object) {
	      return object.type === ObjectType.ME;
	    })[0];
	
	    // Добавляет на карту файрбол по нажатию на Shift.
	    if (this.state.keysPressed.SHIFT) {
	      this.state.objects.push({
	        direction: me.direction,
	        height: 24,
	        speed: 5,
	        sprite: 'img/fireball.gif',
	        type: ObjectType.FIREBALL,
	        width: 24,
	        x: me.direction & Direction.RIGHT ? me.x + me.width : me.x - 24,
	        y: me.y + me.height / 2
	      });
	
	      this.state.keysPressed.SHIFT = false;
	    }
	
	    this.state.garbage = [];
	
	    // Убирает в garbage не используемые на карте объекты.
	    var remainingObjects = this.state.objects.filter(function(object) {
	      ObjectsBehaviour[object.type](object, this.state, delta);
	
	      if (object.state === ObjectState.DISPOSED) {
	        this.state.garbage.push(object);
	        return false;
	      }
	
	      return true;
	    }, this);
	
	    this.state.objects = remainingObjects;
	  },
	
	  /**
	   * Проверка статуса текущего уровня.
	   */
	  checkStatus: function() {
	    // Нет нужны запускать проверку, нужно ли останавливать уровень, если
	    // заранее известно, что да.
	    if (this.state.currentStatus !== Verdict.CONTINUE) {
	      return;
	    }
	
	    if (!this.commonRules) {
	      /**
	       * Проверки, не зависящие от уровня, но влияющие на его состояние.
	       * @type {Array.<functions(Object):Verdict>}
	       */
	      this.commonRules = [
	        /**
	         * Если персонаж мертв, игра прекращается.
	         * @param {Object} state
	         * @return {Verdict}
	         */
	        function checkDeath(state) {
	          var me = state.objects.filter(function(object) {
	            return object.type === ObjectType.ME;
	          })[0];
	
	          return me.state === ObjectState.DISPOSED ?
	            Verdict.FAIL :
	            Verdict.CONTINUE;
	        },
	
	        /**
	         * Если нажата клавиша Esc игра ставится на паузу.
	         * @param {Object} state
	         * @return {Verdict}
	         */
	        function checkKeys(state) {
	          return state.keysPressed.ESC ? Verdict.PAUSE : Verdict.CONTINUE;
	        },
	
	        /**
	         * Игра прекращается если игрок продолжает играть в нее два часа подряд.
	         * @param {Object} state
	         * @return {Verdict}
	         */
	        function checkTime(state) {
	          return Date.now() - state.startTime > 3 * 60 * 1000 ?
	            Verdict.FAIL :
	            Verdict.CONTINUE;
	        }
	      ];
	    }
	
	    // Проверка всех правил влияющих на уровень. Запускаем цикл проверок
	    // по всем универсальным проверкам и проверкам конкретного уровня.
	    // Цикл продолжается до тех пор, пока какая-либо из проверок не вернет
	    // любое другое состояние кроме CONTINUE или пока не пройдут все
	    // проверки. После этого состояние сохраняется.
	    var allChecks = this.commonRules.concat(LevelsRules[this.level]);
	    var currentCheck = Verdict.CONTINUE;
	    var currentRule;
	
	    while (currentCheck === Verdict.CONTINUE && allChecks.length) {
	      currentRule = allChecks.shift();
	      currentCheck = currentRule(this.state);
	    }
	
	    this.state.currentStatus = currentCheck;
	  },
	
	  /**
	   * Принудительная установка состояния игры. Используется для изменения
	   * состояния игры от внешних условий, например, когда необходимо остановить
	   * игру, если она находится вне области видимости и установить вводный
	   * экран.
	   * @param {Verdict} status
	   */
	  setGameStatus: function(status) {
	    if (this.state.currentStatus !== status) {
	      this.state.currentStatus = status;
	    }
	  },
	
	  /**
	   * Отрисовка всех объектов на экране.
	   */
	  render: function() {
	    // Удаление всех отрисованных на странице элементов.
	    this.ctx.clearRect(0, 0, WIDTH, HEIGHT);
	
	    // Выставление всех элементов, оставшихся в this.state.objects согласно
	    // их координатам и направлению.
	    this.state.objects.forEach(function(object) {
	      if (object.sprite) {
	        var image = new Image(object.width, object.height);
	        image.src = (object.spriteReversed && object.direction & Direction.LEFT) ?
	          object.spriteReversed :
	          object.sprite;
	        this.ctx.drawImage(image, object.x, object.y, object.width, object.height);
	      }
	    }, this);
	  },
	
	  /**
	   * Основной игровой цикл. Сначала проверяет состояние всех объектов игры
	   * и обновляет их согласно правилам их поведения, а затем запускает
	   * проверку текущего раунда. Рекурсивно продолжается до тех пор, пока
	   * проверка не вернет состояние FAIL, WIN или PAUSE.
	   */
	  update: function() {
	    if (!this.state.lastUpdated) {
	      this.state.lastUpdated = Date.now();
	    }
	
	    var delta = (Date.now() - this.state.lastUpdated) / 10;
	    this.updateObjects(delta);
	    this.checkStatus();
	
	    switch (this.state.currentStatus) {
	      case Verdict.CONTINUE:
	        this.state.lastUpdated = Date.now();
	        this.render();
	        requestAnimationFrame(function() {
	          this.update();
	        }.bind(this));
	        break;
	
	      case Verdict.WIN:
	      case Verdict.FAIL:
	      case Verdict.PAUSE:
	      case Verdict.INTRO:
	        this.pauseLevel();
	        break;
	    }
	  },
	
	  /**
	   * @param {KeyboardEvent} evt [description]
	   * @private
	   */
	  _onKeyDown: function(evt) {
	    switch (evt.keyCode) {
	      case 37:
	        this.state.keysPressed.LEFT = true;
	        break;
	      case 39:
	        this.state.keysPressed.RIGHT = true;
	        break;
	      case 38:
	        this.state.keysPressed.UP = true;
	        break;
	      case 27:
	        this.state.keysPressed.ESC = true;
	        break;
	    }
	
	    if (evt.shiftKey) {
	      this.state.keysPressed.SHIFT = true;
	    }
	  },
	
	  /**
	   * @param {KeyboardEvent} evt [description]
	   * @private
	   */
	  _onKeyUp: function(evt) {
	    switch (evt.keyCode) {
	      case 37:
	        this.state.keysPressed.LEFT = false;
	        break;
	      case 39:
	        this.state.keysPressed.RIGHT = false;
	        break;
	      case 38:
	        this.state.keysPressed.UP = false;
	        break;
	      case 27:
	        this.state.keysPressed.ESC = false;
	        break;
	    }
	
	    if (evt.shiftKey) {
	      this.state.keysPressed.SHIFT = false;
	    }
	  },
	
	  /** @private */
	  _initializeGameListeners: function() {
	    window.addEventListener('keydown', this._onKeyDown);
	    window.addEventListener('keyup', this._onKeyUp);
	  },
	
	  /** @private */
	  _removeGameListeners: function() {
	    window.removeEventListener('keydown', this._onKeyDown);
	    window.removeEventListener('keyup', this._onKeyUp);
	  }
	};
	
	Game.Verdict = Verdict;
	
	module.exports = Game;


/***/ },
/* 5 */
/***/ function(module, exports) {

	'use strict';
	
	var Gallery = function(srcList) {
	  this.pictures = srcList;
	  this.activePicture = 0;
	  this.galleryOverlay = document.querySelector('.overlay-gallery');
	  this.galleryLeftControl = document.querySelector('.overlay-gallery-control-left');
	  this.galleryRightControl = document.querySelector('.overlay-gallery-control-right');
	  this.galleryCurrent = document.querySelector('.preview-number-current');
	  this.galleryTotal = document.querySelector('.preview-number-total');
	  this.galleryClose = document.querySelector('.overlay-gallery-close');
	};
	
	Gallery.prototype.show = function(activePictureIndex) {
	
	  var self = this;
	
	  this.galleryClose.onclick = function() {
	    self.hide();
	  };
	
	  this.galleryRightControl.onclick = function() {
	    self.setActivePicture(self.activePicture + 1);
	  };
	
	  this.galleryLeftControl.onclick = function() {
	    self.setActivePicture(self.activePicture - 1);
	  };
	
	  this.galleryOverlay.classList.remove('invisible');
	
	  this.setActivePicture(activePictureIndex);
	};
	
	Gallery.prototype.hide = function() {
	
	  this.galleryOverlay.classList.add('invisible');
	
	  this.galleryClose.onclick = null;
	  this.galleryRightControl.onclick = null;
	  this.galleryLeftControl.onclick = null;
	};
	
	Gallery.prototype.setActivePicture = function(activePictureIndex) {
	
	  var IMAGE_LOAD_TIMEOUT = 10000;
	  var GALLERY_IMAGE_WIDHT = 800;
	  var GALLERY_IMAGE_HEIGHT = 800;
	
	  var self = this;
	
	  activePictureIndex = (activePictureIndex < 0) ? 0 : activePictureIndex;
	
	  this.activePicture = (activePictureIndex >= this.pictures.length) ?
	    this.pictures.length - 1 : activePictureIndex;
	
	  var galleryPicture = new Image(GALLERY_IMAGE_WIDHT, GALLERY_IMAGE_HEIGHT);
	
	  var pictureLoadTimeout;
	
	  galleryPicture.onload = function() {
	    clearTimeout(pictureLoadTimeout);
	
	    var galleryPerview = document.querySelector('.overlay-gallery-preview');
	    var galleryPerviewImg = document.querySelector('.overlay-gallery-preview img');
	
	    if (galleryPerviewImg) {
	      galleryPerview.replaceChild(galleryPicture, galleryPerviewImg);
	    } else {
	      galleryPerview.appendChild(galleryPicture);
	    }
	
	    self.galleryCurrent.textContent = self.activePicture + 1;
	    self.galleryTotal.textContent = self.pictures.length;
	  };
	
	  galleryPicture.onerror = function() {
	    galleryPicture.src = '';
	  };
	
	  pictureLoadTimeout = setTimeout(function() {
	    galleryPicture.src = '';
	  }, IMAGE_LOAD_TIMEOUT);
	
	  galleryPicture.src = this.pictures[this.activePicture];
	};
	
	module.exports = Gallery;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var browserCookies = __webpack_require__(7);
	
	var formContainer = document.querySelector('.overlay-container');
	var formCloseButton = document.querySelector('.review-form-close');
	
	var formReview = document.querySelector('.review-form');
	var formReviewFields = formReview.querySelector('.review-fields');
	
	var formReviewName = formReview.querySelector('#review-name');
	var formReviewNameLabel = formReviewFields.querySelector('label[for="review-name"]');
	
	var formReviewText = formReview.querySelector('#review-text');
	var formReviewTextLabel = formReviewFields.querySelector('label[for="review-text"]');
	
	var formReviewSubmit = formReview.querySelector('.review-submit');
	var formReviewMarks = formReview.querySelectorAll('input[name="review-mark"]');
	
	
	/**
	  * Вспомогательные функции
	  */
	
	function getCookieExpireDays() {
	
	  var nowDate = new Date();
	
	  var nowYear = nowDate.getFullYear();
	  var nowMonth = nowDate.getMonth() + 1;
	  var nowDay = nowDate.getDate();
	
	  // Считаем количество дней, прошедших с последнего
	  // прошедшего дня рождения Грейс Хоппер (9 декабря 1906)
	  var birthdayMonth = 9;
	  var birthdayDay = 12;
	
	  var birthdayDate = new Date(nowYear, birthdayMonth - 1, birthdayDay);
	
	  nowDate = new Date(nowYear, nowMonth - 1, nowDay);
	
	  if ((nowDate - birthdayDate) < 0) {
	    //Последнее день рождение было в прошлом году
	    birthdayDate = new Date(nowYear - 1, birthdayMonth - 1, birthdayDay);
	  }
	
	  return (nowDate - birthdayDate) / 1000 / 3600 / 24;
	}
	
	
	function isNotEmpty(tag) {
	  return tag.value.trim().length;
	}
	
	
	var TEXT_REQUIRED_MARK = 3;
	
	function validateReviewForm() {
	
	  var reviewMarkValue = formReview.querySelector('input[name="review-mark"]:checked').value;
	
	  var isSubmitAllowed = isNotEmpty(formReviewName) &&
	    ((reviewMarkValue < TEXT_REQUIRED_MARK && isNotEmpty(formReviewText)) ||
	      (reviewMarkValue >= TEXT_REQUIRED_MARK));
	
	  formReviewSubmit.disabled = !isSubmitAllowed;
	
	  formReviewFields.style.display = isSubmitAllowed ? 'none' : 'inline-block';
	}
	
	
	/**
	  * Обработчики событий полей ввода формы
	  */
	
	formReviewName.oninput = function() {
	
	  formReviewNameLabel.style.display = isNotEmpty(formReviewName) ? 'none' : 'inline';
	
	  validateReviewForm();
	};
	
	formReviewText.oninput = function() {
	
	  formReviewTextLabel.style.display = isNotEmpty(formReviewText) ? 'none' : 'inline';
	
	  validateReviewForm();
	};
	
	var reviewMarksOnChangeHandler = function(evt) {
	
	  formReviewText.required = (evt.currentTarget.value < TEXT_REQUIRED_MARK);
	
	  validateReviewForm();
	};
	
	for (var i = 0; i < formReviewMarks.length; i++) {
	  formReviewMarks[i].onchange = reviewMarksOnChangeHandler;
	}
	
	formReview.onsubmit = function() {
	
	  var reviewMarkValue = formReview.querySelector('input[name="review-mark"]:checked').value;
	
	  var expireDate = { expires: getCookieExpireDays() };
	
	  browserCookies.set('review-name', formReviewName.value, expireDate);
	  browserCookies.set('review-mark', reviewMarkValue, expireDate);
	};
	
	formCloseButton.onclick = function(evt) {
	  evt.preventDefault();
	  form.close();
	};
	
	
	/**
	  * Объект Форма
	  */
	
	var form = {
	  onClose: null,
	
	  /**
	    * @param {Function} cb
	    */
	  open: function(cb) {
	    formContainer.classList.remove('invisible');
	    cb();
	  },
	
	  close: function() {
	    formContainer.classList.add('invisible');
	
	    if (typeof this.onClose === 'function') {
	      this.onClose();
	    }
	  }
	};
	
	
	/**
	  * Установим значения по умолчанию
	  */
	
	var reviewName = browserCookies.get('review-name');
	var reviewMark = browserCookies.get('review-mark');
	
	var checkedReviewMark = formReview.querySelector('input[value="' + reviewMark + '"]');
	
	formReviewName.value = (reviewName) ? reviewName : '';
	formReviewName.required = true;
	
	if (checkedReviewMark) {
	  checkedReviewMark.checked = true;
	}
	
	formReviewText.value = '';
	
	formReviewSubmit.disabled = true;
	
	
	/**
	  * Экспорт
	  */
	
	module.exports = form;


/***/ },
/* 7 */
/***/ function(module, exports) {

	exports.defaults = {};
	
	exports.set = function(name, value, options) {
	  // Retrieve options and defaults
	  var opts = options || {};
	  var defaults = exports.defaults;
	
	  // Apply default value for unspecified options
	  var expires  = opts.expires || defaults.expires;
	  var domain   = opts.domain  || defaults.domain;
	  var path     = opts.path     != undefined ? opts.path     : (defaults.path != undefined ? defaults.path : '/');
	  var secure   = opts.secure   != undefined ? opts.secure   : defaults.secure;
	  var httponly = opts.httponly != undefined ? opts.httponly : defaults.httponly;
	
	  // Determine cookie expiration date
	  // If succesful the result will be a valid Date, otherwise it will be an invalid Date or false(ish)
	  var expDate = expires ? new Date(
	      // in case expires is an integer, it should specify the number of days till the cookie expires
	      typeof expires == 'number' ? new Date().getTime() + (expires * 864e5) :
	      // else expires should be either a Date object or in a format recognized by Date.parse()
	      expires
	  ) : '';
	
	  // Set cookie
	  document.cookie = name.replace(/[^+#$&^`|]/g, encodeURIComponent)                // Encode cookie name
	  .replace('(', '%28')
	  .replace(')', '%29') +
	  '=' + value.replace(/[^+#$&/:<-\[\]-}]/g, encodeURIComponent) +                  // Encode cookie value (RFC6265)
	  (expDate && expDate.getTime() >= 0 ? ';expires=' + expDate.toUTCString() : '') + // Add expiration date
	  (domain   ? ';domain=' + domain : '') +                                          // Add domain
	  (path     ? ';path='   + path   : '') +                                          // Add path
	  (secure   ? ';secure'           : '') +                                          // Add secure option
	  (httponly ? ';httponly'         : '');                                           // Add httponly option
	};
	
	exports.get = function(name) {
	  var cookies = document.cookie.split(';');
	
	  // Iterate all cookies
	  for(var i = 0; i < cookies.length; i++) {
	    var cookie = cookies[i];
	    var cookieLength = cookie.length;
	
	    // Determine separator index ("name=value")
	    var separatorIndex = cookie.indexOf('=');
	
	    // IE<11 emits the equal sign when the cookie value is empty
	    separatorIndex = separatorIndex < 0 ? cookieLength : separatorIndex;
	
	    // Decode the cookie name and remove any leading/trailing spaces, then compare to the requested cookie name
	    if (decodeURIComponent(cookie.substring(0, separatorIndex).replace(/^\s+|\s+$/g, '')) == name) {
	      return decodeURIComponent(cookie.substring(separatorIndex + 1, cookieLength));
	    }
	  }
	
	  return null;
	};
	
	exports.erase = function(name, options) {
	  exports.set(name, '', {
	    expires:  -1,
	    domain:   options && options.domain,
	    path:     options && options.path,
	    secure:   0,
	    httponly: 0}
	  );
	};


/***/ }
/******/ ]);
//# sourceMappingURL=main.js.map