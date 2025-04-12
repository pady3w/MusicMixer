import replicate
 
training = replicate.trainings.create(
    version="sakemin/musicgen-fine-tuner:8d02c56b9a3d69abd2f1d6cc1a65027de5bfef7f0d34bd23e0624ecabb65acac",
    input={
        "dataset_path": "https://drive.google.com/uc?export=download&id=1Xz34eDvOjCadga7XS0cCkl7zkXEbmM69",
    },
    one_same_description= "kendrick lamar funky swag",
    destination="michaelhackmann/music-gen-test"
)