import * as createjs from "createjs-module";
import ROSLIB from "roslib";
import EventEmitter2 from "eventemitter2";
//
/**
 * @author Russell Toris - rctoris@wpi.edu
 */

const ROS2D = {
  REVISION: "0.9.0",
};

/**
 * @author Russell Toris - rctoris@wpi.edu
 */

/**
 * RobotModel will be used to maker robot
 *
 * @constructor
 * @param options - object with following keys:
 *   * withR (optional) - the width of the robot
 *   * length (optional) - the length of the marker
 *   * strokeSize (optional) - the size of the outline
 *   * strokeColor (optional) - the createjs color for the stroke
 *   * fillColor (optional) - the createjs color for the fill
 *   * pulse (optional) - if the marker should "pulse" over time
 *   * textStyle (optional) - textStyle to display robot name
 *   * robotName - name of robot will be displayed
 */

ROS2D.RobotModel = class {
  constructor(options) {
    options = options || {};
    this.scale = options.scale || 1;
    let height = (options.height || 0.25) * this.scale;
    let width = (options.width || 0.2) * this.scale;
    let strokeSize = (options.strokeSize || 0.2) * this.scale;
    let strokeColor =
      options.strokeColor || createjs.Graphics.getRGB(255, 0, 0);
    let fillColor =
      options.fillColor || createjs.Graphics.getRGB(255, 128, 0.66);
    let pointSize = options.pointSize || 0.3;
    let robotName = options.robotName || "Default";
    let textSize = options.textSize || 0.75;
    let textStyle = `${textSize * this.scale}px  Arial, sans-serif`;

    // Robot name
    this.text = new createjs.Text(robotName, textStyle, "#ff7700");
    this.text.textBaseline = "alphabetic";

    // Model Robot point
    this.point = new createjs.Shape();
    this.point.graphics.beginFill(fillColor);
    this.point.graphics.setStrokeStyle(strokeSize);
    this.point.graphics.beginStroke(strokeColor);
    this.point.graphics.drawCircle(0, 0, pointSize);

    // Model Robot reg
    this.shape = new createjs.Shape();
    this.shape.graphics.setStrokeStyle(strokeSize);
    this.shape.graphics.moveTo(0, 0);
    this.shape.graphics.beginStroke(strokeColor);
    this.shape.graphics.beginFill(fillColor);
    this.shape.graphics.lineTo(0, height / 2.0);
    this.shape.graphics.lineTo(width / 2.0, height / 2.0);
    this.shape.graphics.lineTo(width / 2.0, -height / 2.0);
    this.shape.graphics.lineTo(-width / 2.0, -height / 2.0);
    this.shape.graphics.lineTo(-width / 2.0, height / 2.0);
    this.shape.graphics.lineTo(0, height / 2.0);

    this.shape.graphics.moveTo(width / 2.0, -0 / 2.0);
    this.shape.graphics.lineTo(0, -0 / 2.0);

    this.shape.graphics.closePath();
    this.shape.graphics.endFill();
    this.shape.graphics.endStroke();

    this.robotContainer = new createjs.Container();
    // this.robotContainer.addChild(this.point);
    this.robotContainer.addChild(this.text);
    this.robotContainer.addChild(this.shape);
    createjs.Container.call(this);

    this.addChild(this.robotContainer);
  }
  setPos(pos) {
    this.shape.x = pos.position.x;
    this.shape.y = -pos.position.y;
    if (pos.orientation) {
      let q0 = pos.orientation.w;
      let q1 = pos.orientation.x;
      let q2 = pos.orientation.y;
      let q3 = pos.orientation.z;
      // Canvas rotation is clock wise and in degrees
      const rotation =
        (-Math.atan2(2 * (q0 * q3 + q1 * q2), 1 - 2 * (q2 * q2 + q3 * q3)) *
          180.0) /
        Math.PI;
      this.shape.rotation = rotation;
    }

    this.text.x = pos.position.x - 0.7 * this.scale;
    this.text.y = -pos.position.y - 0.7 * this.scale;
  }
};

ROS2D.RobotModel.prototype.__proto__ = createjs.Container.prototype;

/**
 * GoalPoint
 * @param {*} options
 */
ROS2D.GoalPoint = class {
  constructor(options) {
    options = options || {};

    this.strokeSize = options.strokeSize || 0.2;
    this.strokeColor =
      options.strokeColor || createjs.Graphics.getRGB(255, 0, 0);
    this.fillColor =
      options.fillColor || createjs.Graphics.getRGB(255, 128, 0.66);
    this.pointSize = options.pointSize || 0.3;
    this.pointName = options.pointName || "Target Point";
    this.textStyle = options.textSize || "1px Arial, sans-serif";
    this.point = new createjs.Shape();
    this.point.graphics.beginFill(this.pointColor);

    this.point.graphics.setStrokeStyle(this.strokeSize);
    this.point.graphics.beginStroke(this.fillColor);

    this.point.graphics.drawCircle(0, 0, this.pointSize);

    this.text = new createjs.Text(this.pointName, this.textStyle, "#ff7700");

    this.text.textBaseline = "alphabetic";

    this.robotContainer = new createjs.Container();
    this.robotContainer.addChild(this.point);
    this.robotContainer.addChild(this.text);

    createjs.Container.call(this);

    this.addChild(this.robotContainer);
  }
  setPos(pos) {
    this.point.x = pos.position.x;
    this.point.y = -pos.position.y;

    this.text.x = pos.position.x + 0.8;
    this.text.y = -pos.position.y;
  }
};

// =================
ROS2D.GoalPoint.prototype.__proto__ = createjs.Container.prototype;

// Create a target point
ROS2D.TargetPoint = class {
  constructor(options) {
    options = options || {};
    this.scale = options.scale || 1;
    let textSize = options.textSize || 1;
    this.textStyle = `${textSize * this.scale}px  Arial, sans-serif`;
    this.strokeSize = (options.strokeSize || 0.02) * this.scale;
    this.strokeColor =
      options.strokeColor || createjs.Graphics.getRGB(255, 0, 0);
    this.pointColor =
      options.pointColor || createjs.Graphics.getRGB(255, 128, 0.66);
    this.pointSize = (options.pointSize || 0.3) * this.scale;
    this.targetPointContainer = new createjs.Container();
    this.arrowPointContainer = new createjs.Container();

    createjs.Container.call(this);
    this.addChild(this.targetPointContainer);
    this.addChild(this.arrowPointContainer);
  }
  startGoalSelection(pos) {
    this.goalStartPos = pos;
    this.goalOrientationMarker = new ROS2D.ArrowShape({
      size: 3 * this.scale,
      strokeSize: 0.15 * this.scale,
      strokeColor: createjs.Graphics.getRGB(0, 255, 0, 0.66),
      fillColor: createjs.Graphics.getRGB(0, 255, 0, 0.66),
      pulse: false,
    });
    this.goalOrientationMarker.x = pos.x;
    this.goalOrientationMarker.y = -pos.y;
    this.targetPointContainer.addChild(this.goalOrientationMarker);
  }
  orientGoalSelection(pos) {
    let dx = pos.x - this.goalStartPos.x;
    let dy = pos.y - this.goalStartPos.y;
    this.goalOrientationMarker.rotation =
      (-Math.atan2(dy, dx) * 180.0) / Math.PI;
  }
  endGoalSelection() {
    this.goalOrientationMarker.visible = false;

    // Get angle from orientation marker, so that the goal always matches with the marker
    // convert to radians and counter clock wise
    let theta = (-this.goalOrientationMarker.rotation * Math.PI) / 180.0;
    let qz = Math.sin(theta / 2.0);
    let qw = Math.cos(theta / 2.0);
    // this.addPoint({
    //   x: this.goalOrientationMarker.x,
    //   y: this.goalOrientationMarker.y,
    // });
    let quat = new ROSLIB.Quaternion({
      x: 0,
      y: 0,
      z: qz,
      w: qw,
    });
    const RosPose = new ROSLIB.Pose({
      position: this.goalStartPos,
      orientation: quat,
    });
    const goalPose = {
      x: this.goalOrientationMarker.x,
      y: this.goalOrientationMarker.y,
      Orientation: theta,
    };
    return { goalPose, RosPose };
  }
  createPointShape(pos) {
    let point = new createjs.Shape();
    point.graphics.beginFill(this.pointColor);

    point.graphics.setStrokeStyle(this.strokeSize);
    point.graphics.beginStroke(this.pointColor);

    point.graphics.drawCircle(0, 0, this.pointSize);
    point.x = pos.x;
    point.y = pos.y;

    return point;
  }
  addPoint(pos) {
    let text = new createjs.Text(
      pos.pointName || "Target Point",
      this.textStyle,
      "#000"
    );

    text.x = pos.x;
    text.y = pos.y + 0.9 * this.scale;
    text.textBaseline = "alphabetic";

    let point = this.createPointShape(pos);
    this.targetPointContainer.addChild(point);
    this.targetPointContainer.addChild(text);
  }
};

ROS2D.TargetPoint.prototype.__proto__ = createjs.Container.prototype;

// convert the given global Stage coordinates to ROS coordinates
createjs.Stage.prototype.globalToRos = function (x, y) {
  let rosX = (x - this.x) / this.scaleX;
  let rosY = (this.y - y) / this.scaleY;
  return new ROSLIB.Vector3({
    x: rosX,
    y: rosY,
  });
};

// convert the given ROS coordinates to global Stage coordinates
createjs.Stage.prototype.rosToGlobal = function (pos) {
  let x = pos.x * this.scaleX + this.x;
  let y = pos.y * this.scaleY + this.y;
  return {
    x: x,
    y: y,
  };
};

// convert a ROS quaternion to theta in degrees
createjs.Stage.prototype.rosQuaternionToGlobalTheta = function (orientation) {
  // See https://en.wikipedia.org/wiki/Conversion_between_quaternions_and_Euler_angles#Rotation_matrices
  // here we use [x y z] = R * [1 0 0]
  let q0 = orientation.w;
  let q1 = orientation.x;
  let q2 = orientation.y;
  let q3 = orientation.z;
  // Canvas rotation is clock wise and in degrees
  return (
    (-Math.atan2(2 * (q0 * q3 + q1 * q2), 1 - 2 * (q2 * q2 + q3 * q3)) *
      180.0) /
    Math.PI
  );
};

/**
 * @author Russell Toris - rctoris@wpi.edu
 */

/**
 * An image map is a PNG image scaled to fit to the dimensions of a OccupancyGrid.
 *
 * @constructor
 * @param options - object with following keys:
 *   * message - the occupancy grid map meta data message
 *   * image - the image URL to load
 */
ROS2D.ImageMap = class {
  constructor(options) {
    console.log("🚀 ~ file: ros2d.js:297 ~ options:", options);
    options = options || {};
    let mapConfig = options.mapConfig;
    let image = options.image;

    // save the metadata we need
    this.pose = new ROSLIB.Pose({
      position: mapConfig.origin.position,
      orientation: mapConfig.origin.orientation,
    });

    // set the size
    this.width = mapConfig.width;
    this.height = mapConfig.height;

    // create the bitmap
    createjs.Bitmap.call(this, image);
    // change Y direction
    this.y = -this.height * mapConfig.resolution;

    // scale the image
    this.scaleX = mapConfig.resolution;
    this.scaleY = mapConfig.resolution;
    this.width *= this.scaleX;
    this.height *= this.scaleY;

    // set the pose
    this.x += this.pose.position.x;
    this.y -= this.pose.position.y;
  }
};
ROS2D.ImageMap.prototype.__proto__ = createjs.Bitmap.prototype;

/**
 * @author Russell Toris - rctoris@wpi.edu
 */

/**
 * A image map is a PNG image scaled to fit to the dimensions of a OccupancyGrid.
 *
 * Emits the following events:
 *   * 'change' - there was an update or change in the map
 *
 * @constructor
 * @param options - object with following keys:
 *   * ros - the ROSLIB.Ros connection handle
 *   * topic (optional) - the map meta data topic to listen to
 *   * image - the image URL to load
 *   * rootObject (optional) - the root object to add this marker to
 */
ROS2D.ImageMapClient = class {
  constructor(options) {
    let that = this;
    options = options || {};
    let ros = options.ros;
    let topic = options.topic || "/map_metadata";
    this.image = options.image;
    this.rootObject = options.rootObject || new createjs.Container();

    // create an empty shape to start with
    this.currentImage = new createjs.Shape();

    // subscribe to the topic
    // let rosTopic = new ROSLIB.Topic({
    //   ros: ros,
    //   name: topic,
    //   messageType: "nav_msgs/MapMetaData",
    // });
    this.currentImage = new ROS2D.ImageMap({
      mapConfig: options.mapConfig,
      image: this.image,
    });
    this.rootObject.addChild(this.currentImage);
    // work-around for a bug in easeljs -- needs a second object to render correctly
    this.rootObject.addChild(new ROS2D.Grid({ size: 1 }));
    setTimeout(() => {
      that.emit("change");
    }, 1000);

    // rosTopic.subscribe(function (message) {
    //   // we only need this once
    //   rosTopic.unsubscribe();
    //   // create the image
    //   that.currentImage = new ROS2D.ImageMap({
    //     message: message,
    //     image: that.image,
    //   });
    //   that.rootObject.addChild(that.currentImage);
    //   // work-around for a bug in easeljs -- needs a second object to render correctly
    //   that.rootObject.addChild(new ROS2D.Grid({ size: 1 }));
    //   that.emit("change");
    // });
  }
};
ROS2D.ImageMapClient.prototype.__proto__ = EventEmitter2.prototype;

/**
 * @author Russell Toris - rctoris@wpi.edu
 */

/**
 * An OccupancyGrid can convert a ROS occupancy grid message into a createjs Bitmap object.
 *
 * @constructor
 * @param options - object with following keys:
 *   * message - the occupancy grid message
 */
ROS2D.OccupancyGrid = class {
  constructor(options) {
    options = options || {};
    let message = options.message;

    // internal drawing canvas
    let canvas = document.createElement("canvas");
    let context = canvas.getContext("2d");

    // save the metadata we need
    this.pose = new ROSLIB.Pose({
      position: message.info.origin.position,
      orientation: message.info.origin.orientation,
    });

    // set the size
    this.width = message.info.width;
    this.height = message.info.height;
    canvas.width = this.width;
    canvas.height = this.height;

    let imageData = context.createImageData(this.width, this.height);
    for (let row = 0; row < this.height; row++) {
      for (let col = 0; col < this.width; col++) {
        // determine the index into the map data
        let mapI = col + (this.height - row - 1) * this.width;
        // determine the value
        let data = message.data[mapI];
        let val;
        if (data === 100) {
          val = 0;
        } else if (data === 0) {
          val = 255;
        } else {
          val = 127;
        }

        // determine the index into the image data array
        let i = (col + row * this.width) * 4;
        // r
        imageData.data[i] = val;
        // g
        imageData.data[++i] = val;
        // b
        imageData.data[++i] = val;
        // a
        imageData.data[++i] = 255;
      }
    }
    context.putImageData(imageData, 0, 0);

    // create the bitmap
    createjs.Bitmap.call(this, canvas);
    // change Y direction
    this.y = -this.height * message.info.resolution;

    // scale the image
    this.scaleX = message.info.resolution;
    this.scaleY = message.info.resolution;
    this.width *= this.scaleX;
    this.height *= this.scaleY;

    // set the pose
    this.x += this.pose.position.x;
    this.y -= this.pose.position.y;
  }
};
ROS2D.OccupancyGrid.prototype.__proto__ = createjs.Bitmap.prototype;

/**
 * @author Russell Toris - rctoris@wpi.edu
 */

/**
 * A map that listens to a given occupancy grid topic.
 *
 * Emits the following events:
 *   * 'change' - there was an update or change in the map
 *
 * @constructor
 * @param options - object with following keys:
 *   * ros - the ROSLIB.Ros connection handle
 *   * topic (optional) - the map topic to listen to
 *   * rootObject (optional) - the root object to add this marker to
 *   * continuous (optional) - if the map should be continuously loaded (e.g., for SLAM)
 */
ROS2D.OccupancyGridClient = class {
  constructor(options) {
    let that = this;
    options = options || {};
    let ros = options.ros;
    let topic = options.topic || "/map";
    this.continuous = options.continuous;
    this.rootObject = options.rootObject || new createjs.Container();

    // current grid that is displayed
    // create an empty shape to start with, so that the order remains correct.
    this.currentGrid = new createjs.Shape();
    this.rootObject.addChild(this.currentGrid);
    // work-around for a bug in easeljs -- needs a second object to render correctly
    this.rootObject.addChild(new ROS2D.Grid({ size: 1 }));

    // subscribe to the topic
    let rosTopic = new ROSLIB.Topic({
      ros: ros,
      name: topic,
      messageType: "nav_msgs/OccupancyGrid",
      compression: "png",
    });

    rosTopic.subscribe(function (message) {
      // check for an old map
      let index = null;
      if (that.currentGrid) {
        index = that.rootObject.getChildIndex(that.currentGrid);
        that.rootObject.removeChild(that.currentGrid);
      }

      that.currentGrid = new ROS2D.OccupancyGrid({
        message: message,
      });
      if (index !== null) {
        that.rootObject.addChildAt(that.currentGrid, index);
      } else {
        that.rootObject.addChild(that.currentGrid);
      }

      that.emit("change");

      // check if we should unsubscribe
      if (!that.continuous) {
        rosTopic.unsubscribe();
      }
    });
  }
};
ROS2D.OccupancyGridClient.prototype.__proto__ = EventEmitter2.prototype;

/**
 * @author Jihoon Lee- jihoonlee.in@gmail.com
 * @author Russell Toris - rctoris@wpi.edu
 */

/**
 * A static map that receives from map_server.
 *
 * Emits the following events:
 *   * 'change' - there was an update or change in the map
 *
 * @constructor
 * @param options - object with following keys:
 *   * ros - the ROSLIB.Ros connection handle
 *   * service (optional) - the map topic to listen to, like '/static_map'
 *   * rootObject (optional) - the root object to add this marker to
 */
ROS2D.OccupancyGridSrvClient = class {
  constructor(options) {
    let that = this;
    options = options || {};
    let ros = options.ros;
    let service = options.service || "/static_map";
    this.rootObject = options.rootObject || new createjs.Container();

    // current grid that is displayed
    this.currentGrid = null;

    // Setting up to the service
    let rosService = new ROSLIB.Service({
      ros: ros,
      name: service,
      serviceType: "nav_msgs/GetMap",
      compression: "png",
    });

    rosService.callService(new ROSLIB.ServiceRequest(), function (response) {
      console.log("🚀 ~ file: ros2d.js:478 ~ response:", response);
      // check for an old map
      if (that.currentGrid) {
        that.rootObject.removeChild(that.currentGrid);
      }

      that.currentGrid = new ROS2D.OccupancyGrid({
        message: response.map,
      });
      that.rootObject.addChild(that.currentGrid);

      that.emit("change", that.currentGrid);
    });
  }
};
ROS2D.OccupancyGridSrvClient.prototype.__proto__ = EventEmitter2.prototype;

/**
 * @author Bart van Vliet - bart@dobots.nl
 */

/**
 * An arrow with line and triangular head, based on the navigation arrow.
 * Aims to the left at 0 rotation, as would be expected.
 *
 * @constructor
 * @param options - object with following keys:
 *   * size (optional) - the size of the marker
 *   * strokeSize (optional) - the size of the outline
 *   * strokeColor (optional) - the createjs color for the stroke
 *   * fillColor (optional) - the createjs color for the fill
 *   * pulse (optional) - if the marker should "pulse" over time
 */
ROS2D.ArrowShape = class {
  constructor(options) {
    let that = this;
    options = options || {};
    let size = options.size || 0.5;
    let strokeSize = options.strokeSize || 0.02;
    let strokeColor = options.strokeColor || createjs.Graphics.getRGB(0, 0, 0);
    let fillColor = options.fillColor || createjs.Graphics.getRGB(255, 0, 0);
    let pulse = options.pulse;

    // draw the arrow
    let graphics = new createjs.Graphics();

    let headLen = size / 3.0;
    let headWidth = (headLen * 2.0) / 3.0;

    graphics.setStrokeStyle(strokeSize);
    graphics.beginStroke(strokeColor);
    graphics.moveTo(0, 0);
    graphics.lineTo(size - headLen, 0);

    graphics.beginFill(fillColor);
    graphics.moveTo(size, 0);
    graphics.lineTo(size - headLen, headWidth / 2.0);
    graphics.lineTo(size - headLen, -headWidth / 2.0);
    graphics.closePath();
    graphics.endFill();
    graphics.endStroke();

    // create the shape
    createjs.Shape.call(this, graphics);

    // check if we are pulsing
    if (pulse) {
      // have the model "pulse"
      let growCount = 0;
      let growing = true;
      createjs.Ticker.addEventListener("tick", function () {
        if (growing) {
          that.scaleX *= 1.035;
          that.scaleY *= 1.035;
          growing = ++growCount < 10;
        } else {
          that.scaleX /= 1.035;
          that.scaleY /= 1.035;
          growing = --growCount < 0;
        }
      });
    }
  }
};
ROS2D.ArrowShape.prototype.__proto__ = createjs.Shape.prototype;

/**
 * @author Raffaello Bonghi - raffaello.bonghi@officinerobotiche.it
 */

/**
 * A Grid object draw in map.
 *
 * @constructor
 * @param options - object with following keys:
 *  * size (optional) - the size of the grid
 *  * cellSize (optional) - the cell size of map
 *  * lineWidth (optional) - the width of the lines in the grid
 */
ROS2D.Grid = class {
  constructor(options) {
    // let that = this;
    options = options || {};
    let size = options.size || 10;
    let cellSize = options.cellSize || 0.1;
    let lineWidth = options.lineWidth || 0.001;
    // draw the arrow
    let graphics = new createjs.Graphics();
    // line width
    graphics.setStrokeStyle(lineWidth * 5);
    graphics.beginStroke(createjs.Graphics.getRGB(0, 0, 0));
    graphics.beginFill(createjs.Graphics.getRGB(255, 0, 0));
    graphics.moveTo(-size * cellSize, 0);
    graphics.lineTo(size * cellSize, 0);
    graphics.moveTo(0, -size * cellSize);
    graphics.lineTo(0, size * cellSize);
    graphics.endFill();
    graphics.endStroke();

    graphics.setStrokeStyle(lineWidth);
    graphics.beginStroke(createjs.Graphics.getRGB(0, 0, 0));
    graphics.beginFill(createjs.Graphics.getRGB(255, 0, 0));
    for (let i = -size; i <= size; i++) {
      graphics.moveTo(-size * cellSize, i * cellSize);
      graphics.lineTo(size * cellSize, i * cellSize);
      graphics.moveTo(i * cellSize, -size * cellSize);
      graphics.lineTo(i * cellSize, size * cellSize);
    }
    graphics.endFill();
    graphics.endStroke();
    // create the shape
    createjs.Shape.call(this, graphics);
  }
};
ROS2D.Grid.prototype.__proto__ = createjs.Shape.prototype;

/**
 * @author Russell Toris - rctoris@wpi.edu
 */

/**
 * A navigation arrow is a directed triangle that can be used to display orientation.
 *
 * @constructor
 * @param options - object with following keys:
 *   * size (optional) - the size of the marker
 *   * strokeSize (optional) - the size of the outline
 *   * strokeColor (optional) - the createjs color for the stroke
 *   * fillColor (optional) - the createjs color for the fill
 *   * pulse (optional) - if the marker should "pulse" over time
 */
ROS2D.NavigationArrow = class {
  constructor(options) {
    let that = this;
    options = options || {};
    let size = options.size || 10;
    let strokeSize = options.strokeSize || 3;
    let strokeColor = options.strokeColor || createjs.Graphics.getRGB(0, 0, 0);
    let fillColor = options.fillColor || createjs.Graphics.getRGB(255, 0, 0);
    let pulse = options.pulse;

    // draw the arrow
    let graphics = new createjs.Graphics();
    // line width
    graphics.setStrokeStyle(strokeSize);
    graphics.moveTo(-size / 2.0, -size / 2.0);
    graphics.beginStroke(strokeColor);
    graphics.beginFill(fillColor);
    graphics.lineTo(size, 0);
    graphics.lineTo(-size / 2.0, size / 2.0);
    graphics.closePath();
    graphics.endFill();
    graphics.endStroke();

    // create the shape
    createjs.Shape.call(this, graphics);

    // check if we are pulsing
    if (pulse) {
      // have the model "pulse"
      let growCount = 0;
      let growing = true;
      createjs.Ticker.addEventListener("tick", function () {
        if (growing) {
          that.scaleX *= 1.035;
          that.scaleY *= 1.035;
          growing = ++growCount < 10;
        } else {
          that.scaleX /= 1.035;
          that.scaleY /= 1.035;
          growing = --growCount < 0;
        }
      });
    }
  }
};
ROS2D.NavigationArrow.prototype.__proto__ = createjs.Shape.prototype;

/**
 * @author Inigo Gonzalez - ingonza85@gmail.com
 */

/**
 * A navigation image that can be used to display orientation.
 *
 * @constructor
 * @param options - object with following keys:
 *   * size (optional) - the size of the marker
 *   * image - the image to use as a marker
 *   * pulse (optional) - if the marker should "pulse" over time
 */
ROS2D.NavigationImage = class {
  constructor(options) {
    let that = this;
    options = options || {};
    let size = options.size || 10;
    let image_url = options.image;
    let pulse = options.pulse;
    let alpha = options.alpha || 1;

    let originals = {};
    let calculateScale = function (_size) {
      return _size / image.width;
    };

    let paintImage = function () {
      createjs.Bitmap.call(that, image);
      let scale = calculateScale(size);
      that.alpha = alpha;
      that.scaleX = scale;
      that.scaleY = scale;
      that.regY = that.image.height / 2;
      that.regX = that.image.width / 2;
      originals["rotation"] = that.rotation;
      Object.defineProperty(that, "rotation", {
        get: function () {
          return originals["rotation"] + 90;
        },
        set: function (value) {
          originals["rotation"] = value;
        },
      });

      if (pulse) {
        // have the model "pulse"
        let growCount = 0;
        let growing = true;
        let SCALE_SIZE = 1.02;
        createjs.Ticker.addEventListener("tick", function () {
          if (growing) {
            that.scaleX *= SCALE_SIZE;
            that.scaleY *= SCALE_SIZE;
            growing = ++growCount < 10;
          } else {
            that.scaleX /= SCALE_SIZE;
            that.scaleY /= SCALE_SIZE;
            growing = --growCount < 0;
          }
        });
      }
    };

    let image = new Image();
    image.onload = paintImage;
    image.src = image_url;
  }
};

ROS2D.NavigationImage.prototype.__proto__ = createjs.Bitmap.prototype;

/**
 * @author Bart van Vliet - bart@dobots.nl
 */

/**
 * A shape to draw a nav_msgs/Path msg
 *
 * @constructor
 * @param options - object with following keys:
 *   * path (optional) - the initial path to draw
 *   * strokeSize (optional) - the size of the outline
 *   * strokeColor (optional) - the createjs color for the stroke
 */
ROS2D.PathShape = class {
  constructor(options) {
    options = options || {};
    this.scale = options.scale || 1;
    let path = options.path;
    this.strokeSize = (options.strokeSize || 3) * this.scale;
    this.strokeColor = options.strokeColor || createjs.Graphics.getRGB(0, 0, 0);

    // draw the line
    this.graphics = new createjs.Graphics();

    if (path !== null && typeof path !== "undefined" && path.pose[0]) {
      this.graphics.setStrokeStyle(this.strokeSize);
      this.graphics.beginStroke(this.strokeColor);
      this.graphics.moveTo(
        path.poses[0].pose.position.x / this.scaleX,
        path.poses[0].pose.position.y / -this.scaleY
      );
      for (let i = 1; i < path.poses.length; ++i) {
        this.graphics.lineTo(
          path.poses[i].pose.position.x / this.scaleX,
          path.poses[i].pose.position.y / -this.scaleY
        );
      }
      this.graphics.endStroke();
    }

    // create the shape
    createjs.Shape.call(this, this.graphics);
  }
  /**
   * Set the path to draw
   *
   * @param path of type nav_msgs/Path
   */
  setPath(path) {
    this.graphics.clear();
    try {
      if (path !== null && typeof path !== "undefined" && path.poses[0]) {
        this.graphics.setStrokeStyle(this.strokeSize);
        this.graphics.beginStroke(this.strokeColor);
        this.graphics.moveTo(
          path.poses[0].pose.position.x / this.scaleX,
          path.poses[0].pose.position.y / -this.scaleY
        );
        for (let i = 1; i < path.poses.length; ++i) {
          this.graphics.lineTo(
            path.poses[i].pose.position.x / this.scaleX,
            path.poses[i].pose.position.y / -this.scaleY
          );
        }
        this.graphics.endStroke();
      } else {
        throw new Error("something is wrongs");
      }
    } catch (error) {
      console.log(error);
    }
  }
};

ROS2D.PathShape.prototype.__proto__ = createjs.Shape.prototype;

/**
 * @author Bart van Vliet - bart@dobots.nl
 */

/**
 * A polygon that can be edited by an end user
 *
 * @constructor
 * @param options - object with following keys:
 *   * pose (optional) - the first pose of the trace
 *   * lineSize (optional) - the width of the lines
 *   * lineColor (optional) - the createjs color of the lines
 *   * pointSize (optional) - the size of the points
 *   * pointColor (optional) - the createjs color of the points
 *   * fillColor (optional) - the createjs color to fill the polygon
 *   * lineCallBack (optional) - callback function for mouse interaction with a line
 *   * pointCallBack (optional) - callback function for mouse interaction with a point
 */
ROS2D.PolygonMarker = class {
  constructor(options) {
    //	let that = this;
    options = options || {};

    this.lineStrokeSize = options.lineStrokeSize || 0.03;
    this.lineStrokeColor =
      options.lineStrokeColor || createjs.Graphics.getRGB(0, 0, 255, 0.66);

    this.fillColor =
      options.pointColor || createjs.Graphics.getRGB(255, 128, 0.66);

    // CSS for each point target
    this.pointSize = options.pointSize || 0.05;
    this.pointColor =
      options.pointColor || createjs.Graphics.getRGB(255, 128, 0.66);
    this.strokeSize = options.strokeSize || 0.02;
    this.strokeColor =
      options.strokeColor || createjs.Graphics.getRGB(255, 0, 0);
    // *****************
    this.lineCallBack = options.lineCallBack;
    this.pointCallBack = options.pointCallBack;

    // Array of point shapes
    //	this.points = [];
    this.pointContainer = new createjs.Container();

    // Array of line shapes
    //	this.lines = [];
    this.lineContainer = new createjs.Container();

    this.fillShape = new createjs.Shape();

    // Container with all the lines and points
    createjs.Container.call(this);

    this.addChild(this.fillShape);
    this.addChild(this.lineContainer);
    this.addChild(this.pointContainer);
  }
  /**
   * Internal use only
   */
  createLineShape(startPoint, endPoint) {
    let line = new createjs.Shape();
    line.graphics.setStrokeStyle(this.lineStrokeSize);
    line.graphics.beginStroke(this.lineStrokeColor);
    //line.graphics.moveTo(startPoint.x, startPoint.y);
    //line.graphics.lineTo(endPoint.x, endPoint.y);
    this.editLineShape(line, startPoint, endPoint);

    let that = this;
    line.addEventListener("mousedown", function (event) {
      if (
        that.lineCallBack !== null &&
        typeof that.lineCallBack !== "undefined"
      ) {
        that.lineCallBack(
          "mousedown",
          event,
          that.lineContainer.getChildIndex(event.target)
        );
      }
    });

    return line;
  }
  /**
   * Internal use only
   */
  editLineShape(line, startPoint, endPoint) {
    line.graphics.clear();
    line.graphics.setStrokeStyle(this.lineStrokeSize);
    line.graphics.beginStroke(this.lineStrokeColor);
    line.graphics.moveTo(startPoint.x, startPoint.y);
    line.graphics.lineTo(endPoint.x, endPoint.y);
  }
  /**
   * Internal use only
   */
  createPointShape(pos) {
    let point = new createjs.Shape();
    point.graphics.beginFill(this.pointColor);

    point.graphics.setStrokeStyle(this.strokeSize);
    point.graphics.beginStroke(this.strokeColor);

    point.graphics.drawCircle(0, 0, this.pointSize);
    point.x = pos.x;
    point.y = -pos.y;

    let that = this;
    point.addEventListener("mousedown", function (event) {
      if (
        that.pointCallBack !== null &&
        typeof that.pointCallBack !== "undefined"
      ) {
        that.pointCallBack(
          "mousedown",
          event,
          that.pointContainer.getChildIndex(event.target)
        );
      }
    });

    return point;
  }
  /**
   * Adds a point to the polygon
   *
   * @param position of type ROSLIB.Vector3
   */
  addPoint(pos) {
    let point = this.createPointShape(pos);
    this.pointContainer.addChild(point);
    let numPoints = this.pointContainer.getNumChildren();

    // 0 points -> 1 point, 0 lines
    // 1 point  -> 2 points, lines: add line between previous and new point, add line between new point and first point
    // 2 points -> 3 points, 3 lines: change last line, add line between new point and first point
    // 3 points -> 4 points, 4 lines: change last line, add line between new point and first point
    // etc
    // if (numPoints < 2) {
    //   // Now 1 point
    // } else if (numPoints < 3) {
    //   // Now 2 points: add line between previous and new point
    //   let line = this.createLineShape(
    //     this.pointContainer.getChildAt(numPoints - 2),
    //     point
    //   );
    //   this.lineContainer.addChild(line);
    // }
    // if (numPoints > 2) {
    //   // Now 3 or more points: change last line
    //   this.editLineShape(
    //     this.lineContainer.getChildAt(numPoints - 2),
    //     this.pointContainer.getChildAt(numPoints - 2),
    //     point
    //   );
    // }
    // if (numPoints > 1) {
    //   // Now 2 or more points: add line between new point and first point
    //   let lineEnd = this.createLineShape(
    //     point,
    //     this.pointContainer.getChildAt(0)
    //   );
    //   this.lineContainer.addChild(lineEnd);
    // }
    // this.drawFill();
  }
  /**
   * Removes a point from the polygon
   *
   * @param obj either an index (integer) or a point shape of the polygon
   */
  remPoint(obj) {
    let index;
    //	let point;
    if (obj instanceof createjs.Shape) {
      index = this.pointContainer.getChildIndex(obj);
      //		point = obj;
    } else {
      index = obj;
      //		point = this.pointContainer.getChildAt(index);
    }

    // 0 points -> 0 points, 0 lines
    // 1 point  -> 0 points, 0 lines
    // 2 points -> 1 point,  0 lines: remove all lines
    // 3 points -> 2 points, 2 lines: change line before point to remove, remove line after point to remove
    // 4 points -> 3 points, 3 lines: change line before point to remove, remove line after point to remove
    // etc
    let numPoints = this.pointContainer.getNumChildren();

    if (numPoints < 2) {
    } else if (numPoints < 3) {
      // 2 points: remove all lines
      this.lineContainer.removeAllChildren();
    } else {
      // 3 or more points: change line before point to remove, remove line after point to remove
      this.editLineShape(
        this.lineContainer.getChildAt((index - 1 + numPoints) % numPoints),
        this.pointContainer.getChildAt((index - 1 + numPoints) % numPoints),
        this.pointContainer.getChildAt((index + 1) % numPoints)
      );
      this.lineContainer.removeChildAt(index);
    }
    this.pointContainer.removeChildAt(index);
    //	this.points.splice(index, 1);
    // this.drawFill();
  }
  /**
   * Moves a point of the polygon
   *
   * @param obj either an index (integer) or a point shape of the polygon
   * @param position of type ROSLIB.Vector3
   */
  movePoint(obj, newPos) {
    let index;
    let point;
    if (obj instanceof createjs.Shape) {
      index = this.pointContainer.getChildIndex(obj);
      point = obj;
    } else {
      index = obj;
      point = this.pointContainer.getChildAt(index);
    }
    point.x = newPos.x;
    point.y = -newPos.y;

    let numPoints = this.pointContainer.getNumChildren();
    if (numPoints > 1) {
      // line before moved point
      let line1 = this.lineContainer.getChildAt(
        (index - 1 + numPoints) % numPoints
      );
      this.editLineShape(
        line1,
        this.pointContainer.getChildAt((index - 1 + numPoints) % numPoints),
        point
      );

      // line after moved point
      let line2 = this.lineContainer.getChildAt(index);
      this.editLineShape(
        line2,
        point,
        this.pointContainer.getChildAt((index + 1) % numPoints)
      );
    }

    // this.drawFill();
  }
  /**
   * Splits a line of the polygon: inserts a point at the center of the line
   *
   * @param obj either an index (integer) or a line shape of the polygon
   */
  splitLine(obj) {
    let index;
    let line;
    if (obj instanceof createjs.Shape) {
      index = this.lineContainer.getChildIndex(obj);
      line = obj;
    } else {
      index = obj;
      line = this.lineContainer.getChildAt(index);
    }
    let numPoints = this.pointContainer.getNumChildren();
    let xs = this.pointContainer.getChildAt(index).x;
    let ys = this.pointContainer.getChildAt(index).y;
    let xe = this.pointContainer.getChildAt((index + 1) % numPoints).x;
    let ye = this.pointContainer.getChildAt((index + 1) % numPoints).y;
    let xh = (xs + xe) / 2.0;
    let yh = (ys + ye) / 2.0;
    let pos = new ROSLIB.Vector3({ x: xh, y: -yh });

    // Add a point in the center of the line to split
    let point = this.createPointShape(pos);
    this.pointContainer.addChildAt(point, index + 1);
    ++numPoints;

    // Add a line between the new point and the end of the line to split
    let lineNew = this.createLineShape(
      point,
      this.pointContainer.getChildAt((index + 2) % numPoints)
    );
    this.lineContainer.addChildAt(lineNew, index + 1);

    // Set the endpoint of the line to split to the new point
    this.editLineShape(line, this.pointContainer.getChildAt(index), point);

    // this.drawFill();
  }
  /**
   * Internal use only
   */
  drawFill() {
    let numPoints = this.pointContainer.getNumChildren();
    if (numPoints > 2) {
      let g = this.fillShape.graphics;
      g.clear();
      g.setStrokeStyle(0);
      g.moveTo(
        this.pointContainer.getChildAt(0).x,
        this.pointContainer.getChildAt(0).y
      );
      g.beginStroke();
      g.beginFill(this.fillColor);
      for (let i = 1; i < numPoints; ++i) {
        g.lineTo(
          this.pointContainer.getChildAt(i).x,
          this.pointContainer.getChildAt(i).y
        );
      }
      g.closePath();
      g.endFill();
      g.endStroke();
    } else {
      this.fillShape.graphics.clear();
    }
  }
};

ROS2D.PolygonMarker.prototype.__proto__ = createjs.Container.prototype;

/**
 * @author Bart van Vliet - bart@dobots.nl
 */

/**
 * A trace of poses, handy to see where a robot has been
 *
 * @constructor
 * @param options - object with following keys:
 *   * pose (optional) - the first pose of the trace
 *   * strokeSize (optional) - the size of the outline
 *   * strokeColor (optional) - the createjs color for the stroke
 *   * maxPoses (optional) - the maximum number of poses to keep, 0 for infinite
 *   * minDist (optional) - the minimal distance between poses to use the pose for drawing (default 0.05)
 */
ROS2D.TraceShape = class {
  constructor(options) {
    //	let that = this;
    options = options || {};
    let pose = options.pose;
    this.strokeSize = options.strokeSize || 3;
    this.strokeColor = options.strokeColor || createjs.Graphics.getRGB(0, 0, 0);
    this.maxPoses = options.maxPoses || 100;
    this.minDist = options.minDist || 0.05;

    // Store minDist as the square of it
    this.minDist = this.minDist * this.minDist;

    // Array of the poses
    // TODO: do we need this?
    this.poses = [];

    // Create the graphics
    this.graphics = new createjs.Graphics();
    this.graphics.setStrokeStyle(this.strokeSize);
    this.graphics.beginStroke(this.strokeColor);

    // Add first pose if given
    if (pose !== null && typeof pose !== "undefined") {
      this.poses.push(pose);
    }

    // Create the shape
    createjs.Shape.call(this, this.graphics);
  }
  /**
   * Adds a pose to the trace and updates the graphics
   *
   * @param pose of type ROSLIB.Pose
   */
  addPose(pose) {
    let last = this.poses.length - 1;
    if (last < 0) {
      this.poses.push(pose);
      this.graphics.moveTo(
        pose.position.x / this.scaleX,
        pose.position.y / -this.scaleY
      );
    } else {
      let prevX = this.poses[last].position.x;
      let prevY = this.poses[last].position.y;
      let dx = pose.position.x - prevX;
      let dy = pose.position.y - prevY;
      if (dx * dx + dy * dy > this.minDist) {
        this.graphics.lineTo(
          pose.position.x / this.scaleX,
          pose.position.y / -this.scaleY
        );
        this.poses.push(pose);
      }
    }
    if (this.maxPoses > 0 && this.maxPoses < this.poses.length) {
      this.popFront();
    }
  }
  /**
   * Removes front pose and updates the graphics
   */
  popFront() {
    if (this.poses.length > 0) {
      this.poses.shift();
      // TODO: shift drawing instructions rather than doing it all over
      this.graphics.clear();
      this.graphics.setStrokeStyle(this.strokeSize);
      this.graphics.beginStroke(this.strokeColor);
      this.graphics.lineTo(
        this.poses[0].position.x / this.scaleX,
        this.poses[0].position.y / -this.scaleY
      );
      for (let i = 1; i < this.poses.length; ++i) {
        this.graphics.lineTo(
          this.poses[i].position.x / this.scaleX,
          this.poses[i].position.y / -this.scaleY
        );
      }
    }
  }
};

ROS2D.TraceShape.prototype.__proto__ = createjs.Shape.prototype;

/**
 * @author Bart van Vliet - bart@dobots.nl
 */

/**
 * Adds panning to a view
 *
 * @constructor
 * @param options - object with following keys:
 *   * rootObject (optional) - the root object to apply panning to
 */
ROS2D.PanView = class {
  constructor(options) {
    options = options || {};
    this.rootObject = options.rootObject;

    // get a handle to the stage
    if (this.rootObject instanceof createjs.Stage) {
      this.stage = this.rootObject;
    } else {
      this.stage = this.rootObject.getStage();
    }

    this.startPos = new ROSLIB.Vector3();
  }
  startPan(startX, startY) {
    this.startPos.x = startX;
    this.startPos.y = startY;
  }
  pan(curX, curY) {
    this.stage.x += curX - this.startPos.x;
    this.startPos.x = curX;
    this.stage.y += curY - this.startPos.y;
    this.startPos.y = curY;
    const stageCurrent = {};

    stageCurrent.x = this.stage.x;
    stageCurrent.y = this.stage.y;
    // return stageCurrent;
  }
};

/**
 * @author Russell Toris - rctoris@wpi.edu
 */

/**
 * A Viewer can be used to render an interactive 2D scene to a HTML5 canvas.
 *
 * @constructor
 * @param options - object with following keys:
 *   * divID - the ID of the div to place the viewer in
 *   * width - the initial width, in pixels, of the canvas
 *   * height - the initial height, in pixels, of the canvas
 *   * background (optional) - the color to render the background, like '#efefef'
 */
ROS2D.Viewer = class {
  constructor(options) {
    // let that = this;
    options = options || {};
    let divID = options.divID;
    console.log("🚀 ~ file: ros2d.js:1189 ~ divID:", divID);
    this.autoScale = options.autoScale || false;
    this.width = options.width;
    this.height = options.height;

    const divIDwrapper = document.getElementById(divID);
    if (this.width === "100%") {
      this.width = divIDwrapper.offsetWidth;
    }
    if (this.height === "100%") {
      this.height = divIDwrapper.offsetHeight;
    }

    let background = options.background || "rgba(0, 0, 0, 0.08)";

    // create the canvas to render to
    let canvas = document.getElementById("canvas-map");
    console.log("🚀 ~ file: ros2d.js:1208 ~ canvas:", canvas);
    if (!canvas) {
      canvas = document.createElement("canvas");
    }

    canvas.width = this.width;
    canvas.height = this.height;
    canvas.style.background = background;

    canvas.id = "canvas-map";

    // create the easel to use
    this.scene = new createjs.Stage(canvas);

    // change Y axis center
    this.scene.y = this.height;

    // add the renderer to the page
    divIDwrapper.appendChild(canvas);

    // update at 30fps
    createjs.Ticker.framerate = 30;
    createjs.Ticker.addEventListener("tick", this.scene);
  }
  /**
   * Add the given createjs object to the global scene in the viewer.
   *
   * @param object - the object to addChild
   */
  addObject(object) {
    this.scene.addChild(object);
  }
  /**
   * Scale the scene to fit the given width and height into the current canvas.
   *
   * @param width - the width to scale to in meters
   * @param height - the height to scale to in meters
   */
  scaleToDimensions(width, height) {
    // restore to values before shifting, if ocurred
    this.scene.x =
      typeof this.scene.x_prev_shift !== "undefined"
        ? this.scene.x_prev_shift
        : this.scene.x;
    this.scene.y =
      typeof this.scene.y_prev_shift !== "undefined"
        ? this.scene.y_prev_shift
        : this.scene.y;

    // save scene scaling
    this.scene.scaleX = this.width / width;

    this.scene.scaleY = this.height / height;

    // const scale = {
    //   scaleX: this.scene.scaleX,
    //   scaleY: this.scene.scaleY,
    // };
    // return scale;
  }
  /**
   * Shift the main view of the canvas by the given amount. This is based on the
   * ROS coordinate system. That is, Y is opposite that of a traditional canvas.
   *
   * @param x - the amount to shift by in the x direction in meters
   * @param y - the amount to shift by in the y direction in meters
   */
  shift(x, y) {
    // save current offset
    this.scene.x_prev_shift = this.scene.x;
    this.scene.y_prev_shift = this.scene.y;

    // shift scene by scaling the desired offset
    this.scene.x -= x * this.scene.scaleX;
    this.scene.y += y * this.scene.scaleY;
  }
};

/**
 * @author Bart van Vliet - bart@dobots.nl
 */

/**
 * Adds zooming to a view
 *
 * @constructor
 * @param options - object with following keys:
 *   * rootObject (optional) - the root object to apply zoom to
 *   * minScale (optional) - minimum scale to set to preserve precision
 */
ROS2D.ZoomView = class {
  constructor(options) {
    options = options || {};
    this.rootObject = options.rootObject;
    this.minScale = options.minScale || 0.001;

    // get a handle to the stage
    if (this.rootObject instanceof createjs.Stage) {
      this.stage = this.rootObject;
    } else {
      this.stage = this.rootObject.getStage();
    }

    this.center = new ROSLIB.Vector3();
    this.startShift = new ROSLIB.Vector3();
    this.startScale = new ROSLIB.Vector3();
  }
  startZoom(centerX, centerY) {
    this.center.x = centerX;
    this.center.y = centerY;
    this.startShift.x = this.stage.x;
    this.startShift.y = this.stage.y;
    this.startScale.x = this.stage.scaleX;
    this.startScale.y = this.stage.scaleY;
  }
  zoom(zoom) {
    // Make sure scale doesn't become too small
    if (this.startScale.x * zoom < this.minScale) {
      zoom = this.minScale / this.startScale.x;
    }
    if (this.startScale.y * zoom < this.minScale) {
      zoom = this.minScale / this.startScale.y;
    }

    this.stage.scaleX = this.startScale.x * zoom;
    this.stage.scaleY = this.startScale.y * zoom;

    this.stage.x =
      this.startShift.x -
      (this.center.x - this.startShift.x) *
        (this.stage.scaleX / this.startScale.x - 1);
    this.stage.y =
      this.startShift.y -
      (this.center.y - this.startShift.y) *
        (this.stage.scaleY / this.startScale.y - 1);
  }
};

/**
 * Send and draw a goal pose
 *
 * @constructor
 * @param options - object with following keys:
 *   * ros - the ROSLIB.Ros connection handle
 *   * rootObject (optional) - the root object to render to
 *   * actionTopic (optional) - the action server topic to use for navigation, like '/move_base'
 *   * actionMsgType (optional) - the navigation action message type, like 'move_base_msgs/MoveBaseAction'
 *   * mapFrame (optional) - the frame of the map to use when sending a goal, like '/map'
 */
ROS2D.NavGoal = class {
  constructor(options) {
    options = options || {};
    let ros = options.ros;
    this.rootObject = options.rootObject || new createjs.Container();
    let actionTopic = options.actionTopic || "/move_base";
    let actionMsgType =
      options.actionMsgType || "move_base_msgs/MoveBaseAction";
    this.mapFrame = options.mapFrame || "map";

    // setup the actionlib client
    this.actionClient = new ROSLIB.ActionClient({
      ros: ros,
      actionName: actionMsgType,
      serverName: actionTopic,
    });

    // get a handle to the stage
    if (this.rootObject instanceof createjs.Stage) {
      this.stage = this.rootObject;
    } else {
      this.stage = this.rootObject.getStage();
    }

    this.container = new createjs.Container();
    this.rootObject.addChild(this.container);

    // marker for goal orientation
    this.goalOrientationMarker = new ROS2D.ArrowShape({
      size: 0.5,
      strokeSize: 0.05,
      fillColor: createjs.Graphics.getRGB(0, 255, 0, 0.66),
      pulse: false,
    });
    this.goalOrientationMarker.visible = false;
    this.container.addChild(this.goalOrientationMarker);

    // Used to set the goal marker
    this.goalStartPos = null;

    this.initScaleSet = false;
  }
  /**
   * Initialize scale, current scale will be used for the goal markers
   */
  initScale() {
    if (this.initScaleSet) {
      console.log("Warning: scale has already been initialized!");
      // TODO: reinit
    }
    this.initScaleSet = true;
    this.initScaleX = 1.0 / this.stage.scaleX;
    this.initScaleY = 1.0 / this.stage.scaleY;
  }
  /**
   * Start goal selection, given position will be the goal position, draw the orientation marker
   *
   * @param pos - current selection position on the map in meters (ROSLIB.Vector3)
   */
  startGoalSelection(pos) {
    this.goalStartPos = pos;
    this.goalOrientationMarker.startGoalSelectionvisible = true;
    this.goalOrientationMarker.scaleX = 1.0 / this.stage.scaleX;
    this.goalOrientationMarker.scaleY = 1.0 / this.stage.scaleY;
    this.goalOrientationMarker.x = pos.x;
    this.goalOrientationMarker.y = -pos.y;
  }
  /**
   * Orient goal, after starting the goal, this function updates the orientation of the goal orientation marker
   *
   * @param pos - current selection position on the map in meters (ROSLIB.Vector3)
   */
  orientGoalSelection(pos) {
    this.goalOrientationMarker.scaleX = 1.0 / this.stage.scaleX;
    this.goalOrientationMarker.scaleY = 1.0 / this.stage.scaleY;
    let dx = pos.x - this.goalStartPos.x;
    let dy = pos.y - this.goalStartPos.y;
    this.goalOrientationMarker.rotation =
      (-Math.atan2(dy, dx) * 180.0) / Math.PI;
  }
  /**
   * End of selecting a goal, removes the orientation marker
   *
   * @param pos - current selection position on the map in meters (ROSLIB.Vector3)
   *
   * @returns the goal pose (ROSLIB.Pose)
   */
  endGoalSelection() {
    this.goalOrientationMarker.visible = true;

    // Get angle from orientation marker, so that the goal always matches with the marker
    // convert to radians and counter clock wise
    let theta = (-this.goalOrientationMarker.rotation * Math.PI) / 180.0;
    let qz = Math.sin(theta / 2.0);
    let qw = Math.cos(theta / 2.0);
    let quat = new ROSLIB.Quaternion({
      x: 0,
      y: 0,
      z: qz,
      w: qw,
    });
    return new ROSLIB.Pose({
      position: this.goalStartPos,
      orientation: quat,
    });
  }
  /**
   * Send a goal to the navigation stack with the given pose.
   * Draw the goal
   *
   * @param pose - the goal pose (ROSLIB.Pose)
   */
  sendGoal(pose) {
    // create a goal
    let goal = new ROSLIB.Goal({
      actionClient: this.actionClient,
      goalMessage: {
        target_pose: {
          header: {
            frame_id: this.mapFrame,
          },
          pose: pose,
        },
      },
    });
    goal.send();

    // create a marker for the goal
    let goalMarker = new ROS2D.ArrowShape({
      size: 0.5,
      strokeSize: 0.05,
      fillColor: createjs.Graphics.getRGB(255, 64, 128, 0.66),
      pulse: true,
    });
    goalMarker.x = pose.position.x;
    goalMarker.y = -pose.position.y;
    goalMarker.rotation = this.stage.rosQuaternionToGlobalTheta(
      pose.orientation
    );
    // goalMarker.scaleX = this.initScaleX;
    //  goalMarker.scaleY = this.initScaleY;
    this.container.addChild(goalMarker);

    let that = this;
    goal.on("result", function (reponse) {
      console.log("🚀 ~ file: ros2d.js:1609 ~ reponse:", reponse);
      that.container.removeChild(goalMarker);
    });
  }
};

/**
 * Listens for pose msgs and draws the robot pose and a trace
 *
 * @constructor
 * @param options - object with following keys:
 *   * ros - the ROSLIB.Ros connection handle
 *   * rootObject (optional) - the root object to render to
 *   * poseTopic (optional) - the pose topic to subscribe to, like '/robot_pose', must be of type: 'geometry_msgs/Pose'
 *   * withTrace (optional) - whether to draw the robot's trace (default: true)
 *   * maxTraceLength (optional) - maximum length of the trace in number of poses (0 for infinite)
 *   * traceColor (optional) - color of the trace shape
 *   * traceSize (optional) - size of the trace shape
 *   * robotColor (optional) - color of the robot shape
 *   * robotSize (optional) - size of the robot shape
 *   * robotShape (optional) - shape of your robot, front should point to the east at 0 rotation
 */
ROS2D.PoseAndTrace = class {
  constructor(options) {
    options = options || {};
    let ros = options.ros;
    this.rootObject = options.rootObject || new createjs.Container();
    let poseTopic = options.poseTopic || "/robot_pose";
    let messageType = options.messageType || "geometry_msgs/Pose";
    this.withTrace = options.withTrace || false;
    this.maxTraceLength = options.maxTraceLength || 100;
    let traceColor =
      options.traceColor || createjs.Graphics.getRGB(0, 150, 0, 0.66);
    let traceSize = options.traceSize || 1.5;
    let robotColor =
      options.robotColor || createjs.Graphics.getRGB(255, 0, 0, 0.66);
    let robotSize = options.robotSize || 15;
    this.robotMarker = options.robotShape || null;

    // get a handle to the stage
    if (this.rootObject instanceof createjs.Stage) {
      this.stage = this.rootObject;
    } else {
      this.stage = this.rootObject.getStage();
    }

    // shape for the trace
    if (this.withTrace) {
      this.trace = new ROS2D.TraceShape({
        strokeSize: traceSize,
        strokeColor: traceColor,
        maxPoses: this.maxTraceLength,
      });
      this.trace.visible = false;
      this.rootObject.addChild(this.trace);
    }

    // marker for the robot
    if (!this.robotMarker) {
      this.robotMarker = new ROS2D.ArrowShape({
        size: robotSize,
        strokeSize: 1,
        strokeColor: robotColor,
        fillColor: robotColor,
        pulse: true,
      });
    }
    this.robotMarker.visible = false;
    this.rootObject.addChild(this.robotMarker);

    this.initScaleSet = false;

    // setup a listener for the robot pose
    let poseListener = new ROSLIB.Topic({
      ros: ros,
      name: poseTopic,
      messageType: messageType,
      throttle_rate: 100,
    });
    poseListener.subscribe(this.updatePose.bind(this));
  }
  /**
   * Initialize scale, current scale will be used for the goal markers
   */
  initScale() {
    if (this.initScaleSet) {
      console.log("Warning: scale has already been initialized!");
      // TODO: reinit
    }
    this.initScaleSet = true;
    this.robotMarker.scaleX = 1.0 / this.stage.scaleX;
    this.robotMarker.scaleY = 1.0 / this.stage.scaleY;
  }
  /**
   * Update the robot's pose: move the robot marker and add to trace
   *
   * @param pose - the robot's pose (geometry_msgs/Pose)
   */
  updatePose(message) {
    // update the robot's position and rotation on the map
    let pose_curr = message.pose.pose;
    // console.log("🚀 ~ file: ros2d.js:1597 ~ pose_curr:", pose_curr)
    if (pose_curr) {
      this.robotMarker.x = pose_curr.position.x;
      this.robotMarker.y = -pose_curr.position.y;
      this.robotMarker.rotation = this.stage.rosQuaternionToGlobalTheta(
        pose_curr.orientation
      );
    }

    if (this.initScaleSet) {
      this.robotMarker.visible = true;
    }

    // Draw trace
    if (this.withTrace === true && this.initScaleSet === true) {
      this.trace.addPose(pose_curr);
      this.trace.visible = true;
    }
  }
};

export default ROS2D;
