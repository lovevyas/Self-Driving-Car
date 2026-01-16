class Car{
    constructor(x,y,width,height){
        this.x=x;
        this.y=y;
        this.width=width;
        this.height=height;

        this.speed=0;
        this.accel=0.2;
        this.maxSpeed=5;
        this.friction=0.05;
        this.angle=0;

        this.damaged = false;
        this.sensor=new Sensor(this);
        this.controls=new Controls();
        this.polygon = this.#createPolygon();
    }

    update(roadBorders){
        this.#move();
        this.polygon = this.#createPolygon();
        this.damaged = this.#accessDamage(roadBorders);
        this.sensor.update(roadBorders);
    }

    #accessDamage(roadBorders){
        for (let i = 0; i<roadBorders.length; i++) {
            if(polysIntersect(this.polygon,roadBorders[i])){
                return true;
            }
        }
        return false;
    }
    // basic rectangle car
    // #createPolygon(){
    //     const points=[];
    //     const rad = Math.hypot(this.width,this.height)/2;
    //     const alpha = Math.atan2(this.width,this.height);
    //     //top right and left
    //     points.push({
    //         x:this.x-Math.sin(this.angle-alpha)*rad,
    //         y:this.y-Math.cos(this.angle-alpha)*rad
    //     });
    //     points.push({
    //         x:this.x-Math.sin(this.angle+alpha)*rad,
    //         y:this.y-Math.cos(this.angle+alpha)*rad
    //     });
    //     //bottom right left
    //     points.push({
    //         x:this.x-Math.sin(Math.PI+this.angle-alpha)*rad,
    //         y:this.y-Math.cos(Math.PI+this.angle-alpha)*rad
    //     });
    //     points.push({
    //         x:this.x-Math.sin(Math.PI+this.angle+alpha)*rad,
    //         y:this.y-Math.cos(Math.PI+this.angle+alpha)*rad
    //     });

    //     return points;
    // }

    //sports car
    #createPolygon(){
        const points=[];
        // rad is the distance from center to corners
        const rad = Math.hypot(this.width,this.height)/2;
        // alpha is the angle to the corners
        const alpha = Math.atan2(this.width,this.height);

        // We use 8 points now to get a better sports car shape
        // Adjust these multipliers (e.g., 0.6, 0.9, 0.4) to change the shape
        
        // Front Nose Points (narrower)
        points.push({
            x:this.x-Math.sin(this.angle)*rad*1.1, // Front tip
            y:this.y-Math.cos(this.angle)*rad*1.1
        });
        points.push({
            x:this.x-Math.sin(this.angle - alpha * 0.4)*rad,
            y:this.y-Math.cos(this.angle - alpha * 0.4)*rad
        });
        
        // Mid Points (wide shoulders/doors)
        points.push({
            x:this.x-Math.sin(this.angle - alpha * 0.9)*rad*0.8,
            y:this.y-Math.cos(this.angle - alpha * 0.9)*rad*0.8
        });
        points.push({
            x:this.x-Math.sin(Math.PI + this.angle - alpha * 0.9)*rad*0.9,
            y:this.y-Math.cos(Math.PI + this.angle - alpha * 0.9)*rad*0.9
        });

        // Rear Points (wider rear end)
        points.push({
            x:this.x-Math.sin(Math.PI + this.angle - alpha * 0.6)*rad*1.1,
            y:this.y-Math.cos(Math.PI + this.angle - alpha * 0.6)*rad*1.1
        });
        points.push({
            x:this.x-Math.sin(Math.PI + this.angle + alpha * 0.6)*rad*1.1,
            y:this.y-Math.cos(Math.PI + this.angle + alpha * 0.6)*rad*1.1
        });

        // Mid Points (wide shoulders/doors left side)
        points.push({
            x:this.x-Math.sin(Math.PI + this.angle + alpha * 0.9)*rad*0.9,
            y:this.y-Math.cos(Math.PI + this.angle + alpha * 0.9)*rad*0.9
        });
        points.push({
            x:this.x-Math.sin(this.angle + alpha * 0.9)*rad*0.8,
            y:this.y-Math.cos(this.angle + alpha * 0.9)*rad*0.8
        });

        return points;
    }


    #move(){
        if(this.controls.forward){
            this.speed+=this.accel;
        }
        if(this.controls.reverse){
            this.speed-=this.accel;
        }
        if(this.speed>this.maxSpeed){
            this.speed=this.maxSpeed;
        }
        if(this.speed<-this.maxSpeed/2){
            this.speed=-this.maxSpeed/2;
        }
        if(this.speed>0){
            this.speed-=this.friction;
        }
        if(this.speed<0){
            this.speed+=this.friction;
        }
        if(Math.abs(this.speed)<this.friction){
            this.speed=0;
        }

        if(this.speed!=0){
            const flip = this.speed>0?1:-1;
            if(this.controls.left){
            this.angle+=0.03*flip;
            }
            if(this.controls.right){
            this.angle-=0.03*flip;
            }
        }
    

        this.x-=Math.sin(this.angle)*this.speed;
        this.y-=Math.cos(this.angle)*this.speed;

        
    }

    draw(ctx){
        if (!this.polygon) return;

        if(this.damaged){
            ctx.fillStyle="#7f8c8d";
        }else{
            ctx.fillStyle="#2c3e50";
        }

        ctx.beginPath();
        ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
        // i = 1 beacuse the we start from right point
        for (let i = 1; i < this.polygon.length; i++) {
            ctx.lineTo(this.polygon[i].x,this.polygon[i].y);
        }
        ctx.fill();
        // Simple rectangle car
        // ctx.save();
        // ctx.translate(this.x,this.y);
        // ctx.rotate(-this.angle);

        // ctx.beginPath();
        // ctx.rect(
        //     -this.width/2,
        //     -this.height/2,
        //     this.width,
        //     this.height
        // );
        // ctx.fill();
        // ctx.restore();
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.stroke();
        this.sensor.draw(ctx);
    }
}