const mongoose = require('mongoose');
const { Schema } = mongoose;

const cotisaciones = new Schema({
        talents: [{
        Nombre:   {type:String},
        Apellido: {type:String},
        NumCel:   {type:String},
        Email:    {type:String},
        Empresa:  {type:String},
        tecno:    {type:String},
        senority: {type:String},
        Cantmeses:{type:String},
        Idioma:   {type:String},
        mailValidado:                   {type:Boolean},
        Moneda:   {type:String},
        Pais:     {type:String},
        Ciudad:   {type:String},
        PagWeb:   {type:String},
        fullStack1:   {type:String},
        Precio:   {type:Number},
        PrecioFinalHora:   {type:Number},
        cantTotalHoras:   {type:Number},
        costoHoraPromedio:   {type:Number},
        costoFinal:   {type:Number},
        totalHoras:   {type:Number},
        date:     { type: Date, default: Date.now },
        user:     { type: String },
        NombreContacto:   {type:String},
        celContacto:   {type:String},
        Obs:   {type:String},
        tipoCont:   {type:String},
        fechaContact:   {type: Date},
        }],
    Nombre:                   {type:String},
    Apellido:                 {type:String},
    NumCel:                   {type:String},
    Email:                    {type:String},
    Empresa:                  {type:String},
    tecno:                    {type:String},
    senority:                 {type:String},
    Cantmeses:                {type:String},
    Idioma:                   {type:String},
    Moneda:                   {type:String},
    Pais:                     {type:String},
    Ciudad:                   {type:String},
    PagWeb:                   {type:String},
    fullStack1:               {type:String},
    Precio:                   {type:Number},
    PrecioFinalHora:          {type:Number},
    cantTotalHoras:           {type:Number},
    costoHoraPromedio:        {type:Number},
    costoFinal:               {type:Number},
    totalHoras:               {type:Number},
    date:                     { type: Date, default: Date.now },
    user:                     { type: String },
    NombreContacto:           {type:String},
    celContacto:              {type:String},
    Obs:                      {type:String},
    tipoCont:                 {type:String},
    fechaContact:             {type: Date},
    custom:                   {type:Boolean},
    siMod:                    {type:Boolean},
    sofObjetivo:              {type:String},
    RubroEmp:                 {type:String},
    tecnoFrontend:            {type:String},
    tecnoBackend:             {type:String},
    CustomSoft:               {type:Boolean},
    appirestFull:             {type:Boolean},
    IOT:                      {type:Boolean},
    PWA:                       {type:String},
    Estadisticas:              {type:String},
    pasarelaPagos:             {type:String},
    clouding:                  {type:String},
    traking:                   {type:String},
    CiberSeg:                  {type:String},
    PW:                       {type:Boolean},
    pesosArg:                 {type:String},
    PrecioEstadisticas1:     {type:String},
    PreciopasarelaPagos1:    {type:String},
    Preciotracking1:         {type:String},
    Precioclouding1:         {type:String},
    PrecioPWAS1:             {type:String},
    PreciociberSeg:          {type:String},
    presio1:                 {type:String},
    desarrollo: [{ 
        
    }]
});

module.exports = mongoose.model('cotisaciones', cotisaciones)