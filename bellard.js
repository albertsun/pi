// http://bellard.org/pi/
// http://bellard.org/pi/pi.c


function mul_mod(a,b,m) {
  a = ~~a;
  b = ~~b;
  m = ~~m;
  return ~~((a*b) % m);
}

// http://math.stackexchange.com/questions/25390/how-to-find-the-inverse-modulo-m
/* return the inverse of x mod y */
function inv_mod(x,y) {
  var q,u,v,a,c,t;

  u = ~~x;
  v = ~~y;
  c = 1;
  a = 0;
  do {
    q = ~~(v / u);

    t = c;
    c = a - q * c;
    a = t;

    t = u;
    u = v - q * u;
    v = t;
  } while (u != 0);
  a = a % y;
  if (a < 0) {
    a = y + a;  
  }

  return ~~a;
}

/* return (a^b) mod m */
function pow_mod(a, b, m)
{
    var r, aa;

    r = 1;
    aa = a;
    while (1) {
      if (b & 1) {
        r = mul_mod(r, aa, m);
      }
      b = b >> 1;
      if (b === 0) {
        break;
      }
      aa = mul_mod(aa, aa, m);
    }
    return ~~r;
}

/* return true if n is prime */
function is_prime(n)
{
    var r, i;
    if ((n % 2) === 0) return false;

    r = ~~ Math.sqrt(n);
    for (i = 3; i <= r; i += 2) {
      if ((n % i) == 0) {
        return false;
      }
    }
    return true;
}

/* return the prime number immediatly after n */
function next_prime(n)
{
    do {
      n++;
    } while (!is_prime(n));
    return n;
}

function main(nth) {
  var av, a, vmax, N, n, num, den, k, kq, kq2, t, v, s, i;
  var sum;

  if (!nth || nth <= 0) {
    console.log("Arg must be the digit you want, and 1 or greater");
    return;
  }

  n = Number(nth);

  N = ~~((n + 20) * Math.log(10) / Math.log(2));
  // console.log(N);

  sum = 0;

  for (a = 3; a <= (2 * N); a = next_prime(a)) {
    // console.log(a);
    vmax = ~~(Math.log(2*N) / Math.log(a));
    // console.log(vmax);
    av = 1;
    for (i = 0; i < vmax; i++) {
      av = av * a;
    }
    // console.log(av);

    s = 0;
    num = 1;
    den = 1;
    v = 0;
    kq = 1;
    kq2 = 1;

    for (k = 1; k <= N; k++) {

      t = k;
      if (kq >= a) {
        do {
            t = ~~(t / a);
            v--;
        } while ((t % a) === 0);
        kq = 0;
      }
      kq++;
      num = mul_mod(num, t, av);

      t = (2 * k - 1);
      if (kq2 >= a) {
        if (kq2 === a) {
          do {
            t = ~~(t / a);
            v++;
          } while ((t % a) === 0);
        }
        kq2 -= a;
      }
      den = mul_mod(den, t, av);
      kq2 += 2;

      if (v > 0) {
        t = inv_mod(den, av);
        t = mul_mod(t, num, av);
        t = mul_mod(t, k, av);
        for (i = v; i < vmax; i++) {
          t = mul_mod(t, a, av);
        }
        s += t;
        if (s >= av) {
          s -= av;
        }
      }
    
    }

    t = pow_mod(10, n - 1, av);
    s = mul_mod(s, t, av);

    // console.log(t);
    // console.log(s);
    // console.log(av);
    sum = (sum + (s / av)) % 1.0;
    
    // console.log(sum);
  }

  return ~~(sum * 1e9);
}