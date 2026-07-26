// dati_localita.js
const databaseLocalita = {
    "fisciano": {
        titolo: "Fisciano",
        descrizione: "Sede del campus universitario dell'Unisa, Fisciano unisce l'anima accademica alla tradizione dell'entroterra campano con le sue frazioni storiche.",
        abitanti: "14.000",
        provincia: "Salerno (SA)",
        immaginePrincipale: "IMAGES/fisciano_principale.png",
        stemma: "IMAGES/stemma_fisciano.png",
        tradizione: "Oltre a essere un vivace polo universitario, Fisciano affonda le sue radici in un'antica tradizione contadina legata alla lavorazione del rame e alla coltivazione della nocciola Tonda Giffoni. Si racconta che le sue numerose frazioni collinari, come Pentima e Soccorso, siano nate come rifugi strategici lungo la via romana che collegava Salerno all'Irpinia.",
        galleria1: "IMAGES/fisciano_chiesa_sbartolomeo.png",
        galleria2: "IMAGES/fisciano_soccorso.png",
        galleria3: "IMAGES/fisciano_villa.png"
    },
    "baronissi": {
        titolo: "Baronissi",
        descrizione: "Situata nel cuore della Valle dell'Irno, è nota per la frazione Saragnano, il Convento della SS. Trinità e le sue vivaci attività culturali.",
        abitanti: "17.000",
        provincia: "Salerno (SA)",
        immaginePrincipale: "IMAGES/baronissi_principale.png",
        stemma: "IMAGES/stemma_baronissi.png",
        tradizione: "Baronissi fu teatro di uno storico scontro nel 1861 tra le truppe borboniche e quelle unitarie. Il Convento della SS. Trinità, arroccato sulla collina della Montagnola, ha custodito per secoli antichi manoscritti e rappresenta il cuore spirituale della città, circondato dai borghi medievali di Saragnano e Capo Saragnano.",
        galleria1: "IMAGES/baronissi_saragnano.png",
        galleria2: "IMAGES/baronissi_convento.png",
        galleria3: "IMAGES/baronissi_acquamela.png"
    },
    "mercato-san-severino": {
        titolo: "Mercato San Severino",
        descrizione: "Importante crocevia commerciale e storico dell'Irno, dominato dai maestosi resti del Castello dei Sanseverino e ricco di borghi antichi.",
        abitanti: "22.000",
        provincia: "Salerno (SA)",
        immaginePrincipale: "IMAGES/mercato_san_severino_principale.png",
        stemma: "IMAGES/stemma_mercato_san_severino.png",
        tradizione: "Il suo nome richiama la secolare fiera commerciale concessa nel Medioevo dalla potente famiglia dei Sanseverino. Il castello che domina la città era uno dei complessi fortificati più grandi del Mezzogiorno. Tra le sue frazioni, il borgo di Spiano conserva ancora l'impianto e l'atmosfera dei vecchi casali campani.",
        galleria1: "IMAGES/san_severino_castello.png",
        galleria2: "IMAGES/san_severino_spiano.png",
        galleria3: "IMAGES/san_severino_corto.png"
    },
    "calvanico": {
        titolo: "Calvanico",
        descrizione: "Tranquillo borgo montano immerso nei Picentini, celebre per la pizzochera, i percorsi di trekking verso il Pizzo d'Alvano e le castagne.",
        abitanti: "1.400",
        provincia: "Salerno (SA)",
        immaginePrincipale: "IMAGES/calvanico_principale.png",
        stemma: "IMAGES/stemma_calvanico.png",
        tradizione: "Storicamente isolato tra i boschi dei Picentini, Calvanico è famoso per l'antica produzione della calce nei tipici forni a legna (i 'calcarali'). Un aneddoto locale narra che durante i mesi autunnali la raccolta delle castagne fosse regolata da un rigido codice d'onore comunitario per spartire le risorse tra i vari casali.",
        galleria1: "IMAGES/calvanico_capo_calvanico.png",
        galleria2: "IMAGES/calvanico_bosco.png",
        galleria3: "IMAGES/calvanico_frazione.png"
    },
    "pellezzano": {
        titolo: "Pellezzano",
        descrizione: "Comune collinare alle porte di Salerno, caratterizzato dai borghi storici di Capezzano e Coperchia e da incantevoli scorci panoramici.",
        abitanti: "11.000",
        provincia: "Salerno (SA)",
        immaginePrincipale: "IMAGES/pellezzano_principale.png",
        stemma: "IMAGES/stemma_pellezzano.png",
        tradizione: "Pellezzano vanta una ricca tradizione legata alla lavorazione della ceramica e alla presenza di antiche cartiere lungo la valle del torrente Irno. Frazioni come Coperchia e Capriglia nascondono vicoli in pietra e palazzi nobiliari che in passato ospitavano le residenze estive dei patrizi salernitani.",
        galleria1: "IMAGES/pellezzano_coperchia.png",
        galleria2: "IMAGES/pellezzano_capezzano.png",
        galleria3: "IMAGES/pellezzano_capriglia.png"
    },
    "castiglione-del-genovesi": {
        titolo: "Castiglione del Genovesi",
        descrizione: "Caratteristico paese alle falde dei Monti Picentini, noto per aver dato i natali al filosofo Antonio Genovesi e per la natura incontaminata.",
        abitanti: "1.300",
        provincia: "Salerno (SA)",
        immaginePrincipale: "IMAGES/castiglione_principale.png",
        stemma: "IMAGES/stemma_castiglione.png",
        tradizione: "Legato indissolubilmente alla figura di Antonio Genovesi, padre dell'economia politica illuminista, il borgo conserva intatta la casa natale del filosofo. Una leggenda popolare racconta di passaggi segreti e camminamenti sotterranei che collegavano il centro abitato con le fortificazioni montane circostanti.",
        galleria1: "IMAGES/castiglione_casa_genovesi.png",
        galleria2: "IMAGES/castiglione_piazza.png",
        galleria3: "IMAGES/castiglione_vicolo.png"
    },
    "san-cipriano-picentino": {
        titolo: "San Cipriano Picentino",
        descrizione: "Immerso tra uliveti e noccioleti, è famoso per la produzione di olio EVO di qualità, la castagna e i suggestivi sentieri naturalistici.",
        abitanti: "6.500",
        provincia: "Salerno (SA)",
        immaginePrincipale: "IMAGES/sancipriano_principale.png",
        stemma: "IMAGES/stemma_sancipriano.png",
        tradizione: "Famoso fin dal Medioevo per i suoi fertili terreni agricoli, San Cipriano comprende splendide frazioni come Filetta e Vignale. Un aneddoto storico riporta che l'olio d'oliva qui prodotto fosse così pregiato da essere richiesto direttamente dalle corti nobiliari di Napoli per le tavole reali.",
        galleria1: "IMAGES/sancipriano_filetta.png",
        galleria2: "IMAGES/sancipriano_vignale.png",
        galleria3: "IMAGES/sancipriano_campagna.png"
    },
    "montoro": {
        titolo: "Montoro",
        descrizione: "Ampio comune irpino a pochissimi chilometri da Fisciano, celebre in tutta Italia per la rinomata e dolce Cipolla Ramata di Montoro.",
        abitanti: "19.500",
        provincia: "Avellino (AV)",
        immaginePrincipale: "IMAGES/montoro_principale.png",
        stemma: "IMAGES/stemma_montoro.png",
        tradizione: "Nato dall'unione di ben quindici frazioni storiche (tra cui Banzano, Torchiati e Aterrana), Montoro vanta il borgo medievale di Aterrana, interamente costruito in pietra locale. La celebre Cipolla Ramata viene coltivata secondo metodi tramandati oralmente da generazioni, garantendone la dolcezza unica.",
        galleria1: "IMAGES/montoro_aterrana.png",
        galleria2: "IMAGES/montoro_banzano.png",
        galleria3: "IMAGES/montoro_torchiati.png"
    },
    "bracigliano": {
        titolo: "Bracigliano",
        descrizione: "Noto come il paese della ciliegia e della tradizione musicale, vanta lo storico Convento di San Francesco e la sorgente del fiume Sarno.",
        abitanti: "5.300",
        provincia: "Salerno (SA)",
        immaginePrincipale: "IMAGES/bracigliano_principale.png",
        stemma: "IMAGES/stemma_bracigliano.png",
        tradizione: "Soprannominato 'Terra della Musica' per la straordinaria concentrazione di maestri e bande musicali riconosciute a livello nazionale. Il Convento di San Francesco, risalente al XVII secolo, ospita un chiostro affrescato legato al culto dei frati minori che promuovevano anche la coltivazione della famosa Ciliegia di Bracigliano.",
        galleria1: "IMAGES/bracigliano_convento.png",
        galleria2: "IMAGES/bracigliano_chiostro.png",
        galleria3: "IMAGES/bracigliano_frazione.png"
    },
    "siano": {
        titolo: "Siano",
        descrizione: "Incastonata in una conca naturale, Siano è rinomata per il Palio del Ciuccio, le sue prelibate percoche e le tradizioni legate alla Settimana Santa.",
        abitanti: "9.600",
        provincia: "Salerno (SA)",
        immaginePrincipale: "IMAGES/siano_principale.png",
        stemma: "IMAGES/stemma_siano.png",
        tradizione: "Celebre per il goliardico 'Palio del Ciuccio' in cui i Rioni si sfidano in una gara campestre, Siano conserva una devozione profonda per San Rocco. Durante le epidemie del passato, si narra che la popolazione trovò rifugio tra i valloni della montagna, sviluppando ricette contadine uniche come la braciola caprina.",
        galleria1: "IMAGES/siano_rione_chiamanda.png",
        galleria2: "IMAGES/siano_centro_storico.png",
        galleria3: "IMAGES/siano_montagna.png"
    }
};