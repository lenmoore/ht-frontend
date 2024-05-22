<template>
  <div class="container">
    <div class="body">
      <img
        style="border: 0; width: 90%; height: auto"
        src="https://vatteater.ee/wp-content/uploads/2024/01/haihtuv-tallinn-pilt-landsape-min-Copy.png"
        alt=""
      />
      <h1>Etenduse "Haihtuv Tallinn" publikutestid</h1>

      <div>
        Loe etenduse kohta
        <a
          style="border-bottom: #535bf2 3px solid"
          target="_blank"
          href="https://vatteater.ee/lavastused/haihtuv-tallinn/"
          >siit</a
        >.
      </div>
      <div>
        Kõik publikutestid on tasuta ning toimuvad õues. Kõik testid peale
        viimase kestavad orienteeruvalt kaks tundi.
      </div>
      <div v-for="date in locationTests" class="date-wrapper">
        <h2>{{ date.date }}</h2>
        <div v-for="card in date.tests">
          <div class="card location-card">
            <div class="card-header">
              <img :src="card.image" alt="" />
              <a
                v-if="date.date === '24. mai 2024'"
                href="https://vatteater.ee/lavastused/haihtuv-tallinn/"
                target="_blank"
                >Asukohtade info</a
              >
              <a v-else :href="card.mapLink" target="_blank"
                >Vaata täpset asukohta kaardil</a
              >
            </div>
            <div class="card-body">
              <div class="top">
                <div class="title">{{ card.name }}</div>
                <div class="date">{{ date.date }} {{ card.time }}</div>
                <div class="location">
                  Kohtumispaik: {{ card.meetingPlace }}
                </div>
                <div class="distance">
                  Läbitav distants: {{ card.distance }}
                </div>
                <div class="desc">{{ card.desc }}</div>
              </div>
              <div
                style="
                  width: 100%;
                  display: flex;
                  justify-content: flex-end;
                  flex-direction: row;
                "
              >
                <button @click="openLink(card.link)">Registreeri</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AudienceTests",
  computed: {
    locationDescription() {
      return {
        paljassaare:
          "\n" +
          "NB! Kuna see teekond käib läbi võseriku, siis soovitame kanda pikki pükse ja kinniseid jalanõusid!",
        vineeri:
          "NB! Sellel rännakul saab osaleda ka ratastooli või mõne muu liikuriga.",
        maarjamae:
          "NB! Sel rännakul saab mäest üles ja alla liikudes mõnusa võhmaka!",
        ylemiste: "NB! Sel rännakul tuleb minna üles kõrgest trepist.",
      };
    },
    locationDistance() {
      return {
        paljassaare: "1.5km",
        vineeri: "alla 1km",
        maarjamae: "3km",
        ylemiste: "2km",
      };
    },
    locationMeetingPlace() {
      return {
        paljassaare: "Sitsi trammipeatus",
        vineeri: "Veerenni bussipeatus",
        maarjamae: "Maarjamägi bussipeatus",
        ylemiste: "Suur-Paala trammipeatus",
      };
    },
    locationImage() {
      return {
        paljassaare: "/locations/paljassaare_kohtumispaik.jpeg",
        ylemiste: "/locations/ylemiste_kohtumispaik.jpeg",
        vineeri: "/locations/vineeri_kohtumispaik.jpeg",
        maarjamae: "/locations/maarjamagi_kohtumispaik.jpeg",
        ht: "/locations/HT_Taust.png",
      };
    },
    locationMapLink() {
      return {
        paljassaare:
          "https://www.google.ee/maps/place/Sitsi/@59.4533118,24.7015886,17z/data=!3m1!4b1!4m6!3m5!1s0x4692938f75b53811:0x323b96a6e34612e4!8m2!3d59.4533118!4d24.7041635!16s%2Fg%2F1hjgk3rbm?entry=tts",
        ylemiste:
          "https://www.google.ee/maps/place/Suur-Paala/@59.4268065,24.8146732,17z/data=!3m1!4b1!4m6!3m5!1s0x4692eca89571113f:0x63ba194430a08a1b!8m2!3d59.4268065!4d24.8146732!16s%2Fg%2F11c7wd0hv5?entry=ttu",
        vineeri: "" + "https://maps.app.goo.gl/znvd3YExwLE4vWdf9",
        maarjamae:
          "https://www.google.ee/maps/place/Maarjam%C3%A4gi/@59.4529319,24.8079064,19z/data=!4m6!3m5!1s0x46929336bb00c0b9:0xe58e1c23a9244a7d!8m2!3d59.4529319!4d24.8083278!16s%2Fg%2F1hjh1h3gf?entry=tts",
      };
    },
    locationTests() {
      return [
        {
          date: "22. mai 2024",
          tests: [
            {
              name: "II Maarjamäe publikutest",
              time: "13:00",
              desc: this.locationDescription["maarjamae"],
              mapLink: this.locationMapLink["maarjamae"],
              link: "https://forms.gle/s6aBzbo4dG5cHywZ7",
              distance: this.locationDistance["maarjamae"],
              meetingPlace: this.locationMeetingPlace["maarjamae"],
              image: this.locationImage["maarjamae"],
            },
            {
              name: "II Ülemiste publikutest",
              time: "18:00",
              mapLink: this.locationMapLink["ylemiste"],
              desc: this.locationDescription["ylemiste"],
              link: "https://forms.gle/thmyURu8KFZe5iB87",
              distance: this.locationDistance["ylemiste"],
              meetingPlace: this.locationMeetingPlace["ylemiste"],
              image: this.locationImage["ylemiste"],
            },
          ],
        },
        {
          date: "24. mai 2024",
          tests: [
            {
              name: "Publikutest kõikides lokatsioonides",
              time: "19:00",
              link: "https://forms.gle/RCEgyB46Hidi8Qyn8",
              desc: "Rännak lokatsioonis kestab sõltumatult läbitavast teekonnast orienteeruvalt 1 tund. Vaheaeg on 45 min, mille jooksul tuleb jõuda Sakala 3 Teatrimajja – sinna liikumiseks palume valida enda eelistatud liikumisviis. Soovitame soojalt Tallinna ühistransporti! Teine vaatus leiab aset Sakala 3 Teatrimajas, kus kohtuvad kõik neli rännakugruppi, et vaadata teekonnal loodud filme.",
              distance: "Vastavalt valitud asukohale.",
              meetingPlace: "Vastavalt valitud asukohale.",
              image: this.locationImage["ht"],
            },
          ],
        },
      ];
    },
  },
  methods: {
    openLink(url) {
      window.open(url, "_blank").focus();
    },
  },
};
</script>

<style lang="scss">
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20rem;
}

.body {
  padding: 1rem;

  @media screen and (max-width: 768px) {
    padding: 0;
  }

  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 90%;
}

.card.location-card {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  width: 100%;
  max-width: 80rem;
  @media screen and (max-width: 768px) {
    width: 90%;
    flex-direction: column;
  }

  .card-header {
    display: flex;
    flex-direction: column;
    align-items: flex-end;

    img {
      width: 100%;
    }

    a {
      color: blue;
      border-bottom: 2px solid blue;
    }
  }

  .card-body {
    padding: 0.5rem;
    flex-direction: column;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;

    width: 30rem;

    @media screen and (max-width: 768px) {
      width: 100%;
    }
    height: 100%;

    .title {
      font-size: 1.5rem;
      font-weight: bold;
      margin-top: 1rem;
    }

    .desc {
      margin-top: 2rem;
      font-size: 0.875rem;
    }

    .date {
      margin-top: 1rem;
    }

    .location {
      margin-top: 0.5rem;
    }

    button {
      margin-top: 1rem;
    }
  }
}
</style>
