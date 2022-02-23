import "jquery";
import { getStorage , ref , uploadBytesResumable , getDownloadURL , deleteObject} from "firebase/storage";
import { app } from "./init";
const storage = getStorage(app);

$(function(){
    let droppedFiles;
    $("input").on("change" , function(){
       droppedFiles = ($(this).prop("files"));
       $("form").addClass("file__dropped").addClass("submit__button");
       $("form.file__dropped .file__dropped").text(droppedFiles.item(0).name);
    });
    $("form").on("drag dragstart dragend dragover dragenter dragleave drop",function(e){
        e.preventDefault();
        e.stopPropagation();
    })
        .on("dragover dragenter" , function (e){
            $("form").addClass("is__dragover");
        })
        .on("dragleave dragend drop" , function(){
            $("form").removeClass("is__dragover");
        })
        .on("drop" , function(e){
            droppedFiles =
            droppedFiles = e.originalEvent.dataTransfer.files;
            $("form").addClass("file__dropped").addClass("submit__button");
            $("form.file__dropped .file__dropped").text(droppedFiles.item(0).name);
        })
        // AJAX Call to store the files in the firebase cloud storage
        .on("submit" , function(e){
            e.preventDefault();
            const storageReference = ref(storage , `images/${droppedFiles.item(0).name}`);
            $(this).addClass("file__uploading").removeClass("file__dropped").removeClass("submit__button");
            const uploadTask =  uploadBytesResumable(storageReference,droppedFiles.item(0));
            uploadTask.on("state_changed",
                (snapshot) => {
                const progress = Math.trunc(((snapshot.bytesTransferred / snapshot.totalBytes) *100));
                $("form.file__uploading .file__uploading").find("span.text__progress").text(`${progress} %`);
                $("form.file__uploading .file__uploading .upload__progress").width(`${progress}%`);
                },
                (error) =>{
                    console.log(`Error: ${error}`)
                },
                () => {
                    $(this).addClass("upload__completed");
                    $(this).removeAttr("class")
                    getDownloadURL(storageReference).then((downloadURL)=> {
                        // show the image info with the controls
                        $("main").append(`
                                        <div class="image__row__wrapper">
                                            <div class="image-row">
                                                <div class="image">
                                                    <p>${droppedFiles.item(0).name}</p>
                                                    <p>${Math.trunc((droppedFiles.item(0).size) / 1024)} kb</p>
                                                </div>
                                                <div class="image-controls">
                                                    <button class="display-btn" data-file-url=${downloadURL}><i class="fa fa-eye"></i></button>
                                                    <button class="delete-btn"> <i class="fa fa-minus-circle"></i> </button>
                                                </div>
                                            </div>
                                        </div>
                        `);
                    });
                    $(document).one("click" , ".display-btn" , function(){
                        const url = $(this).data("file-url");
                        $("<img />", {
                            src: url,
                            class: "viewed__image"
                        }).appendTo($(this).parent().parent().parent())
                    });
                    $(document).one("click" , ".delete-btn" , function(){
                        deleteObject(storageReference).then(()=>{
                            $(".image__row__wrapper").remove();
                        });
                    });
                }
            );
        });
});




