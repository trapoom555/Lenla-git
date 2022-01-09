"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
exports.InOutDisplay = exports.InOutBlock = exports.OutputBlock = exports.InputDisplay = exports.InputBlock = exports.Vector2d = exports.Number = exports.Bool = exports.NotiPort = exports.isIPub = exports.isISub = exports.isDisplayable = void 0;
function isDisplayable(object) {
    return "display" in object;
}
exports.isDisplayable = isDisplayable;
function isISub(object) {
    return "update" in object;
}
exports.isISub = isISub;
function isIPub(object) {
    return "notifyAllPort" in object;
}
exports.isIPub = isIPub;
var NotiPort = /** @class */ (function () {
    function NotiPort() {
        this.recivers = [];
    }
    NotiPort.prototype.notify = function () {
        this.recivers.forEach(function (reciver) {
            reciver.update();
        });
    };
    NotiPort.prototype.addReciver = function (reciver) {
        this.recivers.push(reciver);
    };
    return NotiPort;
}());
exports.NotiPort = NotiPort;
var Obj = /** @class */ (function () {
    function Obj() {
    }
    return Obj;
}());
var Int = /** @class */ (function (_super) {
    __extends(Int, _super);
    function Int() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Int;
}(Obj));
var Bool = /** @class */ (function (_super) {
    __extends(Bool, _super);
    function Bool() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Bool;
}(Obj));
exports.Bool = Bool;
var Number = /** @class */ (function (_super) {
    __extends(Number, _super);
    function Number(val) {
        if (val === void 0) { val = null; }
        var _this = _super.call(this) || this;
        if (val != null)
            _this.value = val;
        return _this;
    }
    return Number;
}(Obj));
exports.Number = Number;
var Vector2d = /** @class */ (function (_super) {
    __extends(Vector2d, _super);
    function Vector2d(x, y) {
        var _this = _super.call(this) || this;
        _this.x = x;
        _this.y = y;
        return _this;
    }
    return Vector2d;
}(Obj));
exports.Vector2d = Vector2d;
function notifyAllPort(notiPorts) {
    notiPorts.forEach(function (port) {
        if (port)
            port.notify();
    });
}
var InputBlock = /** @class */ (function () {
    function InputBlock(id, type) {
        this.notiPorts = [];
        this.id = id;
        this.type = type;
    }
    InputBlock.prototype.addNotiPort = function (index, port) {
        this.notiPorts[index] = port;
    };
    InputBlock.prototype.notifyAllPort = function () {
        notifyAllPort(this.notiPorts);
    };
    InputBlock.prototype.deleteAllPort = function () {
        this.notiPorts = [];
    };
    return InputBlock;
}());
exports.InputBlock = InputBlock;
var InputDisplay = /** @class */ (function () {
    function InputDisplay(id, type) {
        this.notiPorts = [];
        this.position = new Vector2d(0, 0);
        this.displayDetail = {};
        this.id = id;
        this.type = type;
    }
    InputDisplay.prototype.addNotiPort = function (index, port) {
        this.notiPorts[index] = port;
    };
    InputDisplay.prototype.notifyAllPort = function () {
        notifyAllPort(this.notiPorts);
    };
    InputDisplay.prototype.deleteAllPort = function () {
        this.notiPorts = [];
    };
    InputDisplay.prototype.setDisplayDetail = function (detail) {
        this.displayDetail = __assign(__assign({}, this.displayDetail), detail);
    };
    InputDisplay.prototype.displayContent = function () {
    };
    InputDisplay.prototype.display = function () {
        try {
            this.displayContent();
        }
        catch (err) {
            console.log(err);
        }
    };
    InputDisplay.prototype.getDisplayData = function () {
    };
    return InputDisplay;
}());
exports.InputDisplay = InputDisplay;
var OutputBlock = /** @class */ (function () {
    function OutputBlock(id, type) {
        this.position = new Vector2d(0, 0);
        this.displayDetail = {};
        this.id = id;
        this.type = type;
    }
    OutputBlock.prototype.addValPort = function (index, obj) {
        this.inValPorts[index] = obj;
    };
    OutputBlock.prototype.updateContent = function () {
    };
    // setDisplayPosition(x: number, y: number) {
    //     this.position.x = x
    //     this.position.y = y
    // }
    OutputBlock.prototype.setDisplayDetail = function (detail) {
        this.displayDetail = __assign(__assign({}, this.displayDetail), detail);
    };
    OutputBlock.prototype.update = function () {
        try {
            this.updateContent();
            this.display();
            this.setDisplayDetail({});
        }
        catch (err) {
            console.log(err);
        }
    };
    OutputBlock.prototype.displayContent = function () {
    };
    OutputBlock.prototype.display = function () {
        try {
            this.displayContent();
        }
        catch (err) {
            console.log(err);
        }
    };
    OutputBlock.prototype.getDisplayData = function () {
        try {
            return this.displayDetail;
        }
        catch (_a) {
        }
    };
    return OutputBlock;
}());
exports.OutputBlock = OutputBlock;
var InOutBlock = /** @class */ (function () {
    function InOutBlock(id, type) {
        this.notiPorts = [];
        this.id = id;
        this.type = type;
    }
    InOutBlock.prototype.addValPort = function (index, obj) {
        while (this.inValPorts.length <= index) {
            this.inValPorts.push(null);
        }
        this.inValPorts[index] = obj;
    };
    // addValNum(index: number, obj: Obj) {
    //     while (this.inValPorts.length <= index) {
    //         this.inValPorts.push(null)
    //     }
    //     this.inValPorts[index] = obj
    // }
    InOutBlock.prototype.updateContent = function () {
    };
    InOutBlock.prototype.update = function () {
        try {
            this.updateContent();
        }
        catch (err) {
            console.log(err);
        }
    };
    InOutBlock.prototype.addNotiPort = function (index, port) {
        this.notiPorts[index] = port;
    };
    InOutBlock.prototype.notifyAllPort = function () {
        notifyAllPort(this.notiPorts);
    };
    return InOutBlock;
}());
exports.InOutBlock = InOutBlock;
var InOutDisplay = /** @class */ (function (_super) {
    __extends(InOutDisplay, _super);
    function InOutDisplay(id, type) {
        var _this = _super.call(this, id, type) || this;
        _this.notiPorts = [];
        _this.displayDetail = {};
        _this.position = new Vector2d(0, 0);
        return _this;
    }
    InOutDisplay.prototype.addValPort = function (index, obj) {
        while (this.inValPorts.length <= index) {
            this.inValPorts.push(null);
        }
        this.inValPorts[index] = obj;
    };
    InOutDisplay.prototype.updateContent = function () {
    };
    InOutDisplay.prototype.update = function () {
        try {
            this.updateContent();
        }
        catch (err) {
            console.log(err);
        }
    };
    InOutDisplay.prototype.addNotiPort = function (index, port) {
        this.notiPorts[index] = port;
    };
    InOutDisplay.prototype.notifyAllPort = function () {
        notifyAllPort(this.notiPorts);
    };
    InOutDisplay.prototype.setDisplayDetail = function (detail) {
        this.displayDetail = __assign(__assign({}, this.displayDetail), detail);
    };
    InOutDisplay.prototype.displayContent = function () {
    };
    InOutDisplay.prototype.display = function () {
        try {
            this.displayContent();
        }
        catch (err) {
            console.log(err);
        }
    };
    InOutDisplay.prototype.getDisplayData = function () {
        try {
            return this.displayDetail;
        }
        catch (_a) {
        }
    };
    return InOutDisplay;
}(InOutBlock));
exports.InOutDisplay = InOutDisplay;
