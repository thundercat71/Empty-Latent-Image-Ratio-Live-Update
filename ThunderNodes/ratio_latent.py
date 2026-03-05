import torch

class RatioLatentNode:
    @classmethod
    def INPUT_TYPES(s):
        return {
            "required": {
                "width": ("INT", {"default": 1024, "min": 64, "max": 8192, "step": 8}),
                "height": ("INT", {"default": 1024, "min": 64, "max": 8192, "step": 8}),
                "ratio": (["Manual", "1:1", "4:3", "3:2", "16:9", "21:9"],),
                "orientation": (["Landscape", "Portrait"],),
                "batch_size": ("INT", {"default": 1, "min": 1, "max": 4096}),
            }
        }

    RETURN_TYPES = ("LATENT",)
    FUNCTION = "generate"
    CATEGORY = "latent"

    def generate(self, width, height, ratio, orientation, batch_size):
        # The JS handles the math, so we just ensure 8-step alignment here
        w = (width // 8) * 8
        h = (height // 8) * 8
        latent = torch.zeros([batch_size, 4, h // 8, w // 8])
        return ({"samples": latent},)

NODE_CLASS_MAPPINGS = {"RatioLatentNode": RatioLatentNode}
NODE_DISPLAY_NAME_MAPPINGS = {"RatioLatentNode": "Empty Latent Image (Ratio)"}