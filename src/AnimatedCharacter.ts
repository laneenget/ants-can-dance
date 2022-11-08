/* Assignment 4: So You Think Ants Can Dance
 * CSCI 4611, Fall 2022, University of Minnesota
 * Instructor: Evan Suma Rosenberg <suma@umn.edu>
 * License: Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International
 */ 

import * as gfx from 'gophergfx'
import { Skeleton } from './Skeleton'
import { MotionClip } from './MotionClip'
import { Pose } from './Pose';
import { Bone } from './Bone';

export class AnimatedCharacter extends gfx.Transform3
{
    public skeleton: Skeleton;
    public fps: number;
    public useAbsolutePosition: boolean;
    
    private clip: MotionClip | null;
    
    private currentTime: number;
    private currentPose: Pose;
    
    private overlayQueue: MotionClip[];
    private overlayTransitionFrames: number[];
    private overlayTime: number;
    private overlayPose: Pose;

    constructor(fps = 60, useAbsolutePosition = true)
    {
        super();
        
        // Create skeleton and add it as a child
        this.skeleton = new Skeleton();
        this.add(this.skeleton);

        this.fps = fps;
        this.useAbsolutePosition = useAbsolutePosition;

        this.clip = null;

        this.currentTime = 0;
        this.currentPose = new Pose();
        
        this.overlayQueue = [];
        this.overlayTransitionFrames = [];
        this.overlayTime = 0;  
        this.overlayPose = new Pose();
    }

    createMeshes(): void
    {
        // Drawing the coordinate axes is a good way to check your work.
        // To start, this will just create the axes for the root node of the
        // character, but once you add this to createMeshesRecursive, you 
        // can draw the axes for each bone.  The visibility of the axes
        // is toggled using a checkbox.
        const axes = new gfx.Axes3(0.15);
        this.skeleton.add(axes);

        // Call the recursive method for each root bone
        this.skeleton.rootBones.forEach((rootBone: Bone) => {
            this.createMeshesRecursive(rootBone)
        });
    }

    private createMeshesRecursive(bone: Bone): void
    {
        // TO DO (PART 1): Draw the coordinate axes for the bone
        const axes = new gfx.Axes3(0.15);
        bone.transform.add(axes);

        // TO DO (PART 3): You will want to draw something different for each
        // part of the body. An if statement like this is an easy way
        // to do that.  You can find the names of additional bones in 
        // the .asf files.  Anything that you create will be automatically
        // be made invisible when the coordinate axes are visibile.
        if(bone.name == 'head')
        {
            const head = new gfx.SphereMesh(0.15);
            head.scale.set(1, 1.5, 1);
            head.material.setColor(new gfx.Color(1, 0, 0));
            head.translateY(bone.length);
            bone.transform.add(head);

            const antennaLeft = new gfx.CylinderMesh(20, 0.75);
            antennaLeft.translateY(bone.length*3);
            antennaLeft.translateX(-bone.length/1.5);
            antennaLeft.scale.set(0.01, 0.5, 0.01);
            antennaLeft.material.setColor(new gfx.Color(0, 0, 0));
            bone.transform.add(antennaLeft);

            const antennaRight = new gfx.CylinderMesh(20, 0.75);
            antennaRight.translateY(bone.length*3);
            antennaRight.translateX(bone.length/1.5);
            antennaRight.scale.set(0.01, 0.5, 0.01);
            antennaRight.material.setColor(new gfx.Color(0, 0, 0));
            bone.transform.add(antennaRight);

            const antennaLeftBend = new gfx.CylinderMesh(20, 0.25);
            antennaLeftBend.translateY(bone.length*5);
            antennaLeftBend.translateX(-bone.length/1.5);
            antennaLeftBend.translateZ(bone.length/2);
            antennaLeftBend.rotateX(90);
            antennaLeftBend.scale.set(0.01, 0.5, 0.01);
            antennaLeftBend.material.setColor(new gfx.Color(0, 0, 0));
            bone.transform.add(antennaLeftBend);

            const antennaRightBend = new gfx.CylinderMesh(20, 0.25);
            antennaRightBend.translateY(bone.length*5);
            antennaRightBend.translateX(bone.length/1.5);
            antennaRightBend.translateZ(bone.length/2);
            antennaRightBend.rotateX(90);
            antennaRightBend.scale.set(0.01, 0.5, 0.01);
            antennaRightBend.material.setColor(new gfx.Color(0, 0, 0));
            bone.transform.add(antennaRightBend);

            const eyeLeft = new gfx.SphereMesh(0.1);
            eyeLeft.scale.set(0.5, 0.5, 0.5);
            eyeLeft.translateY(bone.length);
            eyeLeft.translateX(-bone.length/1.5);
            eyeLeft.translateZ(bone.length);
            eyeLeft.material.setColor(new gfx.Color(0, 0, 0));
            bone.transform.add(eyeLeft);

            const eyeRight = new gfx.SphereMesh(0.1);
            eyeRight.scale.set(0.5, 0.5, 0.5);
            eyeRight.translateY(bone.length);
            eyeRight.translateX(bone.length/1.5);
            eyeRight.translateZ(bone.length);
            eyeRight.material.setColor(new gfx.Color(0, 0, 0));
            bone.transform.add(eyeRight);
        }
        else if(bone.name == 'upperneck')
        {
            const upperneck = new gfx.CylinderMesh(20, bone.length);
            upperneck.rotateY(45);
            upperneck.translateY(-bone.length);
            upperneck.scale.set(0.02, 1, 0.02);
            upperneck.material.setColor(new gfx.Color(0, 0, 0));
            bone.transform.add(upperneck);
        }
        else if(bone.name == 'lowerneck')
        {
            const lowerneck = new gfx.CylinderMesh(20, bone.length);
            lowerneck.rotateY(45);
            lowerneck.translateY(-bone.length);
            lowerneck.scale.set(0.02, 1, 0.02);
            lowerneck.material.setColor(new gfx.Color(0, 0, 0));
            bone.transform.add(lowerneck);
        }
        else if(bone.name == 'thorax')
        {
            const thorax = new gfx.SphereMesh(bone.length);
            thorax.material.setColor(new gfx.Color(1, 0, 0));
            thorax.translateZ(bone.length/2);
            bone.transform.add(thorax);
        }
        else if(bone.name == 'lclavicle')
        {
            const lclavicle = new gfx.CylinderMesh(20, bone.length);
            lclavicle.scale.set(0.02, 1, 0.02);
            lclavicle.material.setColor(new gfx.Color(0, 0, 0));
            lclavicle.rotateZ(90);
            bone.transform.add(lclavicle);
        }
        else if(bone.name == 'lhumerus')
        {
            const lhumerus = new gfx.CylinderMesh(20, bone.length);
            lhumerus.scale.set(0.02, 1, 0.02);
            lhumerus.translateX(-bone.length/2);
            lhumerus.rotateZ(-90);
            lhumerus.material.setColor(new gfx.Color(0, 0, 0));
            bone.transform.add(lhumerus);
        }
        else if(bone.name == 'lradius')
        {
            const lradius = new gfx.CylinderMesh(20, bone.length);
            lradius.scale.set(0.02, 1, 0.02);
            lradius.translateX(-bone.length/2);
            lradius.rotateZ(90);
            lradius.material.setColor(new gfx.Color(0, 0, 0));
            bone.transform.add(lradius);
        }
        else if(bone.name == 'lwrist')
        {
            const lwrist = new gfx.CylinderMesh(20, bone.length);
            lwrist.scale.set(0.02, 1, 0.02);
            lwrist.translateX(-bone.length/2);
            lwrist.rotateZ(-90);
            lwrist.material.setColor(new gfx.Color(0, 0, 0));
            bone.transform.add(lwrist);
        }
        else if(bone.name == 'lhand')
        {
            const lhand = new gfx.CylinderMesh(20, bone.length);
            lhand.scale.set(0.02, 1, 0.02);
            lhand.translateX(-bone.length/2);
            lhand.rotateZ(-90);
            lhand.material.setColor(new gfx.Color(0, 0, 0));
            bone.transform.add(lhand);
        }
        else if(bone.name == 'lthumb')
        {
            const lthumb = new gfx.CylinderMesh(20, bone.length);
            lthumb.scale.set(0.02, 1, 0.02);
            lthumb.translateX(-bone.length/2);
            lthumb.rotateZ(-90);
            lthumb.material.setColor(new gfx.Color(0, 0, 0));
            bone.transform.add(lthumb);
        }
        else if(bone.name == 'rclavicle')
        {
            const rclavicle = new gfx.CylinderMesh(20, bone.length);
            rclavicle.scale.set(0.02, 0.75, 0.02);
            rclavicle.material.setColor(new gfx.Color(0, 0, 0));
            rclavicle.rotateZ(-90);
            bone.transform.add(rclavicle);
        }
        else if(bone.name == 'rhumerus')
        {
            const rhumerus = new gfx.CylinderMesh(20, bone.length);
            rhumerus.scale.set(0.02, 1, 0.02);
            rhumerus.translateX(bone.length/2);
            rhumerus.translateY(bone.length/2);
            rhumerus.rotateZ(-90);
            rhumerus.material.setColor(new gfx.Color(0, 0, 0));
            bone.transform.add(rhumerus);
        }
        else if(bone.name == 'rradius')
        {
            const rradius = new gfx.CylinderMesh(20, bone.length);
            rradius.scale.set(0.02, 1, 0.02);
            rradius.translateX(bone.length/4);
            rradius.translateY(bone.length);
            rradius.rotateZ(-90);
            rradius.material.setColor(new gfx.Color(0, 0, 0));
            bone.transform.add(rradius);
        }
        else if(bone.name == 'rwrist')
        {
            const rwrist = new gfx.CylinderMesh(20, bone.length);
            rwrist.scale.set(0.02, 1, 0.02);
            rwrist.translateX(bone.length/4);
            rwrist.translateY(bone.length*2);
            rwrist.rotateZ(-90);
            rwrist.material.setColor(new gfx.Color(0, 0, 0));
            bone.transform.add(rwrist);
        }
        else if(bone.name == 'rthumb')
        {
            const rthumb = new gfx.CylinderMesh(20, bone.length);
            rthumb.scale.set(0.02, 1, 0.02);
            rthumb.translateX(bone.length/2);
            rthumb.translateY(bone.length*2);
            rthumb.rotateZ(-90);
            rthumb.material.setColor(new gfx.Color(0, 0, 0));
            bone.transform.add(rthumb);
        }
        else if(bone.name == 'rhand')
        {
            const rhand = new gfx.CylinderMesh(20, bone.length);
            rhand.scale.set(0.02, 1, 0.02);
            rhand.translateX(bone.length/2);
            rhand.translateY(bone.length*2);
            rhand.rotateZ(-90);
            rhand.material.setColor(new gfx.Color(0, 0, 0));
            bone.transform.add(rhand);
        }
        else if(bone.name == 'upperback')
        {
            const upperback = new gfx.SphereMesh(bone.length);
            upperback.material.setColor(new gfx.Color(1, 0, 0));
            upperback.translateY(-bone.length/2);
            upperback.translateZ(bone.length);
            bone.transform.add(upperback);
        }
        else if(bone.name == 'lowerback')
        {
            const lowerback = new gfx.SphereMesh(bone.length);
            lowerback.translateY(-bone.length*2);
            lowerback.rotateX(-15);
            lowerback.scale.set(1.2, 2, 1);
            lowerback.material.setColor(new gfx.Color(1, 0, 0));
            bone.transform.add(lowerback);
        }
        else if(bone.name == 'lhipjoint')
        {
            const lhipjoint = new gfx.CylinderMesh(20, bone.length);
            lhipjoint.scale.set(0.02, 1, 0.02);
            lhipjoint.material.setColor(new gfx.Color(0, 0, 0));
            bone.transform.add(lhipjoint);
        }
        else if(bone.name == 'lfemur')
        {
            const lfemur = new gfx.CylinderMesh(20, bone.length);
            lfemur.translateY(bone.length/2);
            lfemur.rotateY(15);
            lfemur.rotateZ(3);
            lfemur.scale.set(0.02, 1, 0.02);
            lfemur.material.setColor(new gfx.Color(0, 0, 0));
            bone.transform.add(lfemur);
        }
        else if(bone.name == 'ltibia')
        {
            const ltibia = new gfx.CylinderMesh(20, bone.length);
            ltibia.scale.set(0.02, 1, 0.02);
            ltibia.translateY(bone.length/1.5);
            ltibia.rotateZ(10.1);
            ltibia.material.setColor(new gfx.Color(0, 0, 0));
            bone.transform.add(ltibia);
        }
        else if(bone.name == 'lfoot')
        {
            const lfoot = new gfx.CylinderMesh(20, bone.length);
            lfoot.scale.set(0.02, 1, 0.02);
            lfoot.translateY(bone.length);
            lfoot.translateX(bone.length);
            lfoot.translateZ(-bone.length);
            lfoot.rotateX(15);
            lfoot.material.setColor(new gfx.Color(0, 0, 0));
            bone.transform.add(lfoot);
        }
        else if(bone.name == 'ltoes')
        {
            const ltoes = new gfx.CylinderMesh(20, bone.length);
            ltoes.scale.set(0.02, 1, 0.02);
            ltoes.translateY(bone.length);
            ltoes.translateX(bone.length);
            ltoes.translateZ(-bone.length);
            ltoes.rotateX(90);
            ltoes.material.setColor(new gfx.Color(0, 0, 0));
            bone.transform.add(ltoes);
        }
        else if(bone.name == 'rhipjoint')
        {
            const rhipjoint = new gfx.CylinderMesh(20, bone.length);
            rhipjoint.scale.set(0.02, 1, 0.02);
            rhipjoint.material.setColor(new gfx.Color(0, 0, 0));
            bone.transform.add(rhipjoint);
        }
        else if(bone.name == 'rfemur')
        {
            const rfemur = new gfx.CylinderMesh(20, bone.length);
            rfemur.translateY(bone.length/2);
            rfemur.rotateZ(3);
            rfemur.scale.set(0.02, 1, 0.02);
            rfemur.material.setColor(new gfx.Color(0, 0, 0));
            bone.transform.add(rfemur);
        }
        else if(bone.name == 'rtibia')
        {
            const rtibia = new gfx.CylinderMesh(20, bone.length);
            rtibia.scale.set(0.02, 1, 0.02);
            rtibia.translateY(bone.length/1.5);
            rtibia.rotateZ(-10.1);
            rtibia.material.setColor(new gfx.Color(0, 0, 0));
            bone.transform.add(rtibia);
        }
        else if(bone.name == 'rfoot')
        {
            const rfoot = new gfx.CylinderMesh(20, bone.length);
            rfoot.scale.set(0.02, 1, 0.02);
            rfoot.translateY(bone.length);
            rfoot.translateX(-bone.length*1.5);
            rfoot.translateZ(-bone.length);
            rfoot.rotateX(15);
            rfoot.material.setColor(new gfx.Color(0, 0, 0));
            bone.transform.add(rfoot);
        }
        else if(bone.name == 'rtoes')
        {
            const rtoes = new gfx.CylinderMesh(20, bone.length);
            rtoes.scale.set(0.02, 1, 0.02);
            rtoes.translateY(bone.length);
            rtoes.translateX(-bone.length);
            rtoes.translateZ(-bone.length);
            rtoes.rotateX(90);
            rtoes.material.setColor(new gfx.Color(0, 0, 0));
            bone.transform.add(rtoes);
        }

        // TO DO (PART 1): Recursively call this function for each of the bone's children
        bone.children.forEach((childBone: Bone) => {
            this.createMeshesRecursive(childBone);
        });
    }

    loadSkeleton(filename: string): void
    {
        this.skeleton.loadFromASF(filename);
    }

    loadMotionClip(filename: string): MotionClip
    {
        const clip = new MotionClip();
        clip.loadFromAMC(filename, this.skeleton);
        return clip;
    }

    play(clip: MotionClip): void
    {
        this.stop();
        this.clip = clip;
        this.currentPose = this.clip.frames[0];
    }

    stop(): void
    {
        this.clip = null;
        this.currentTime = 0;

        this.overlayQueue = [];
        this.overlayTransitionFrames = [];
        this.overlayTime = 0;
    }

    overlay(clip: MotionClip, transitionFrames: number): void
    {
        this.overlayQueue.push(clip);
        this.overlayTransitionFrames.push(transitionFrames);
    }

    update(deltaTime: number): void
    {
        // If the motion queue is empty, then do nothing
        if(!this.clip)
            return;

        // Advance the time
        this.currentTime += deltaTime;

        // Set the next frame number
        let currentFrame = Math.floor(this.currentTime * this.fps);

        if(currentFrame >= this.clip.frames.length)
        {
            currentFrame = 0;
            this.currentTime = 0;   
            this.currentPose = this.clip.frames[0];
        }

        let overlayFrame = 0;

        // Advance the overlay clip if there is one
        if(this.overlayQueue.length > 0)
        {
            this.overlayTime += deltaTime;

            overlayFrame = Math.floor(this.overlayTime * this.fps);

            if(overlayFrame >= this.overlayQueue[0].frames.length)
            {
                this.overlayQueue.shift();
                this.overlayTransitionFrames.shift();
                this.overlayTime = 0;
                overlayFrame = 0;
            }
        }

        const pose = this.computePose(currentFrame, overlayFrame);
        this.skeleton.update(pose, this.useAbsolutePosition);
    }

    public getQueueCount(): number
    {
        return this.overlayQueue.length;
    }

    private computePose(currentFrame: number, overlayFrame: number): Pose
    {
        // If there is an active overlay track
        if(this.overlayQueue.length > 0)
        {
            // Start out with the unmodified overlay pose
            const overlayPose = this.overlayQueue[0].frames[overlayFrame].clone();

            let alpha = 0;

            // Fade in the overlay
            if(overlayFrame < this.overlayTransitionFrames[0])
            {
                alpha = 1 - overlayFrame / this.overlayTransitionFrames[0];
                overlayPose.lerp(this.clip!.frames[currentFrame], alpha);
            }
            // Fade out the overlay
            else if (overlayFrame > this.overlayQueue[0].frames.length - this.overlayTransitionFrames[0])
            {
                alpha = 1 - (this.overlayQueue[0].frames.length - overlayFrame) / this.overlayTransitionFrames[0];
                overlayPose.lerp(this.clip!.frames[currentFrame], alpha);
            }

            if(!this.useAbsolutePosition)
            {
                const relativeOverlayPosition = gfx.Vector3.copy(this.overlayQueue[0].frames[overlayFrame].rootPosition);
                relativeOverlayPosition.subtract(this.overlayPose.rootPosition);

                const relativePosition = gfx.Vector3.copy(this.clip!.frames[currentFrame].rootPosition);
                relativePosition.subtract(this.currentPose.rootPosition);

                relativeOverlayPosition.lerp(relativeOverlayPosition, relativePosition, alpha);
                this.position.add(relativeOverlayPosition);

                this.overlayPose = this.overlayQueue[0].frames[overlayFrame];
                this.currentPose = this.clip!.frames[currentFrame];
            }
            
            return overlayPose;
        }
        // Motion is entirely from the base track
        else
        {
            if(!this.useAbsolutePosition)
            {
                const relativePosition = gfx.Vector3.copy(this.clip!.frames[currentFrame].rootPosition);
                relativePosition.subtract(this.currentPose.rootPosition);
                this.position.add(relativePosition);
                this.currentPose = this.clip!.frames[currentFrame];
            }

            return this.clip!.frames[currentFrame];
        }
    }

    // Entry function for the recursive call
    toggleAxes(showAxes: boolean): void
    {
        this.toggleAxesRecursive(this.skeleton, showAxes);
    }

    private toggleAxesRecursive(object: gfx.Transform3, showAxes: boolean): void
    {
        // Set the visibility of the coordinate axes
        if(object instanceof gfx.Axes3)
        {
            object.material.visible = showAxes;
        }
        // Set the visibility of all materials that are not coordinate axes
        else if(object instanceof gfx.Mesh || object instanceof gfx.MeshInstance || object instanceof gfx.Line3)
        {
            object.material.visible = !showAxes;
        }

        // Call the function recursively for each child node
        object.children.forEach((child: gfx.Transform3) => {
            this.toggleAxesRecursive(child, showAxes);
        });
    }
}