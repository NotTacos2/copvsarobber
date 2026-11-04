const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let invicible = false;
let invicibleappear = false;
let stun = false;
let stunappear = false;
let isthereasecondcop = false;
let isthereathirdcop = false;
const player = { x: 300, y: 220, size: 32, speed: 240 };
const cop = { x: 200, y: 70, size: 32, speed: 140 };
const secondcop = { x: 200, y: 70, size: 32, speed: 165 };
const thirdcop = { x: 200, y: 70, size: 32, speed: 190 };
const inviciblepowerup = { x: 100, y: 100, size: 16 };
const stunpowerup = { x: 100, y: 100, size: 16 };
const coin = { x: 100, y: 100, size: 16 };
let score = 0;
let last = 0;
let timeLeft = 20;
let invicibletimeLeft = 0;
let stuntimeLeft = 0;
let wantedlevel = 1;

function overlaps(a, b) {
    return a.x < b.x + b.size && b.x < a.x + a.size &&
           a.y < b.y + b.size && b.y < a.y + a.size;  
}

function draw() {
    ctx.fillStyle = "grey";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "orange";
    ctx.fillRect(player.x, player.y, player.size, player.size);
    ctx.fillStyle = "blue";
    ctx.fillRect(cop.x, cop.y, cop.size, cop.size);
    ctx.fillStyle = "gold";
    ctx.fillRect(coin.x, coin.y, coin.size, coin.size);
    if (invicibleappear) {
        ctx.fillStyle = "pink";
        ctx.fillRect(inviciblepowerup.x, inviciblepowerup.y, inviciblepowerup.size, inviciblepowerup.size);
    }
    if (stunappear) {
        ctx.fillStyle = "yellow";
        ctx.fillRect(stunpowerup.x, stunpowerup.y, stunpowerup.size, stunpowerup.size);
    }
    if (isthereasecondcop) {
        ctx.fillStyle = "blue";
        ctx.fillRect(secondcop.x, secondcop.y, secondcop.size, secondcop.size);
    };
    if (isthereathirdcop) {
        ctx.fillStyle = "blue";
        ctx.fillRect(thirdcop.x, thirdcop.y, thirdcop.size, thirdcop.size);
    }
    ctx.fillStyle = "white";
    ctx.font = "20px monospace";
    ctx.fillText(`Score: ${score}   Time: ${Math.ceil(timeLeft)}`, 16, 32);
    if (timeLeft <= 0) ctx.fillText("Game over! Press R to try again.", 16, 64);
    if (invicible) ctx.fillText(`Invicible Power up! ${Math.ceil(invicibletimeLeft)}`, 16, 96);
    if (stun) ctx.fillText(`Stun Power up! ${Math.ceil(stuntimeLeft)}`, 16, 96);
    ctx.fillText(`Wanted Level: ${wantedlevel}`, 300, 32);
}

const keys = new Set();
addEventListener("keydown", (e) => keys.add(e.code));
addEventListener("keyup", (e) => keys.delete(e.code));

function update(dt) {
    if (timeLeft <= 0) return;
    timeLeft -= dt;
    if (keys.has("ArrowLeft")) player.x -= player.speed * dt;
    if (keys.has("ArrowRight")) player.x += player.speed * dt;
    if (keys.has("ArrowUp")) player.y -= player.speed * dt;
    if (keys.has("ArrowDown")) player.y += player.speed * dt;

    const x = player.x - cop.x;
    const y = player.y - cop.y;
    
    if (Math.hypot(x, y) > 0 && !stun) {
        cop.x += (x / Math.hypot(x, y)) * cop.speed * dt;
        cop.y += (y / Math.hypot(x, y)) * cop.speed * dt;
    }

    const secondx = player.x - secondcop.x;
    const secondy = player.y - secondcop.y;

    if (Math.hypot(secondx, secondy) > 0 && !stun && isthereasecondcop) {
        secondcop.x += (secondx / Math.hypot(secondx, secondy)) * secondcop.speed * dt;
        secondcop.y += (secondy / Math.hypot(secondx, secondy)) * secondcop.speed * dt;
    }

    const thirdx = player.x - thirdcop.x;
    const thirdy = player.y - thirdcop.y;

    if (Math.hypot(thirdx, thirdy) > 0 && !stun && isthereathirdcop) {
        thirdcop.x += (thirdx / Math.hypot(thirdx, thirdy)) * thirdcop.speed * dt;
        thirdcop.y += (thirdy / Math.hypot(thirdx, thirdy)) * thirdcop.speed * dt;
    }

    if (overlaps(player, cop)) {
        if (!invicible && !stun) {
            timeLeft = 0;
        }
    }

    if (overlaps(player, secondcop) && isthereasecondcop) {
        if (!invicible && !stun) {
            timeLeft = 0;
        }
    }

    if (overlaps(player, thirdcop) && isthereathirdcop) {
        if (!invicible && !stun) {
            timeLeft = 0;
        }
    }

    if (invicible) {
        invicibletimeLeft -= dt;
        if (invicibletimeLeft <= 0) {
            invicible = false;
        }
    }

    if (stun) {
        stuntimeLeft -= dt;
        if (stuntimeLeft <= 0) {
            stun = false;
        }
    }

    if (score >= 25 && !isthereasecondcop) {
        wantedlevel = 2;
        isthereasecondcop = true;
        secondcop.x = Math.random() * (canvas.width - secondcop.size);
        secondcop.y = Math.random() * (canvas.height - secondcop.size);
    }

    if (score >= 100 && !isthereathirdcop) {
        wantedlevel = 3;
        isthereathirdcop = true;
        thirdcop.x = Math.random() * (canvas.width - thirdcop.size);
        thirdcop.y = Math.random() * (canvas.height - thirdcop.size);
    }

    if (invicibleappear) {
        if (overlaps(player, inviciblepowerup)) {
            invicible = true;
            invicibleappear = false;
            invicibletimeLeft = 5;
        }
    }

    if (stunappear) {
        if (overlaps(player, stunpowerup)) {
            stun = true;
            stunappear = false;
            stuntimeLeft = 5;
        }
    }

    if (overlaps(player, coin)) {
        score++;
        timeLeft += 3;
        if (player.speed <= 280) player.speed += 2;
        if (player.size <= 128) player.size += 1;
        coin.x = Math.random() * (canvas.width - coin.size);
        coin.y = Math.random() * (canvas.height - coin.size);
        if (Math.random() < 0.2 && !invicible && !stun) {
            invicibleappear = true;
            stunappear = false;
            inviciblepowerup.x = Math.random() * (canvas.width - inviciblepowerup.size);
            inviciblepowerup.y = Math.random() * (canvas.height - inviciblepowerup.size);
        } else if (Math.random() < 0.3 && !invicible && !stun) {
            stunappear = true;
            invicibleappear = false;
            stunpowerup.x = Math.random() * (canvas.width - stunpowerup.size);
            stunpowerup.y = Math.random() * (canvas.height - stunpowerup.size);
        }
    }
}

addEventListener("keydown", (e) => {
    if (e.code === "KeyR" && timeLeft <= 0) {
        score = 0;
        timeLeft = 20;
        player.x = 300;
        player.y = 220;
        player.speed = 240;
        player.size = 32;
        cop.x = 200;
        cop.y = 70;
        isthereasecondcop = false;
        isthereathirdcop = false;
        wantedlevel = 1;
    }
})

function frame(now) {
    const dt = Math.min((now - last) / 1000, 0.1);
    last = now;
    update(dt);
    draw();
    requestAnimationFrame(frame);
}

requestAnimationFrame(frame);